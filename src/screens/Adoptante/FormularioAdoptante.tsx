import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  adoptanteByUsuarioId,
  updateAdoptante,
} from "../../services/fetchAdoptante";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../theme/ThemeContext";
import { Edad, EspeciePreferida, Sexo, Vivienda } from "../../types/enums";
import { Picker } from "@react-native-picker/picker";
import { deleteUsuario } from "../../services/fetchUsuario";
import { buscarDirecciones, Direccion } from "../../services/mapBox";

type FormularioAdoptanteProps = {
  setRedirect: (val: string | null) => void;
  onCancel: () => void;
};

const { width } = Dimensions.get("window");
const isSmall = width <= 480;
const isTablet = width > 480 && width <= 840;

const CARD_WIDTH = isSmall
  ? width * 0.94
  : isTablet
  ? Math.min(width * 0.7, 520)
  : 520;

export default function FormularioAdoptante({
  setRedirect,
  onCancel,
}: FormularioAdoptanteProps) {
  const [rutActual, setRutActual] = useState<string | null>(null);
  const [adoptanteRut, setAdoptanteRut] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState<number>(0);
  const [experienciaMascotas, setExperienciaMascotas] = useState<"Si" | "No">(
    "No"
  );
  const [cantidadMascotas, setCantidadMascotas] = useState<number>(0);
  const [especiePreferida, setEspeciePreferida] = useState<EspeciePreferida>(
    EspeciePreferida.CUALQUIERA
  );
  const [tipoVivienda, setTipoVivienda] = useState<Vivienda>(
    Vivienda.CASA_PATIO
  );
  const [sexo, setSexo] = useState<Sexo>(Sexo.CUALQUIERA);
  const [edadBuscada, setEdadBuscada] = useState<Edad>(Edad.CACHORRO);
  const [motivoAdopcion, setMotivoAdopcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comuna, setComuna] = useState("");
  const [latitud, setLatitud] = useState<number | undefined>(undefined);
  const [longitud, setLongitud] = useState<number | undefined>(undefined);
  const [sugerenciasComuna, setSugerenciasComuna] = useState<Direccion[]>([]);
  const [loadingComuna, setLoadingComuna] = useState(false);
  const [comunaSeleccionada, setComunaSeleccionada] = useState<string | null>(
    null
  );

  const { theme } = useTheme();

  useEffect(() => {
    const loadAdoptante = async () => {
      setLoading(true);
      try {
        const data = await adoptanteByUsuarioId();
        if (!data) throw new Error("No se encontró adoptante");
        setRutActual(data.rut);
      } catch (err: any) {
        setError(err.message || "Error al cargar datos del adoptante");
      } finally {
        setLoading(false);
      }
    };

    loadAdoptante();
  }, []);

  const handleSave = async () => {
    if (!adoptanteRut?.trim()) {
      setError("Debe ingresar un RUT");
      return;
    }

    const rutRegex = /^\d{7,8}[0-9kK]$/;
    if (!rutRegex.test(adoptanteRut)) {
      setError("Rut inválido");
      return;
    }

    if (!nombre.trim()) {
      setError("Debe ingresar nombre");
      return;
    }
    if (!direccion.trim()) {
      setError("Debe ingresar dirección");
      return;
    }
    if (comuna !== comunaSeleccionada) {
      setError("Debes seleccionar una comuna de la lista");
      return;
    }
    if (!telefono.trim()) {
      setError("Debe ingresar teléfono");
      return;
    }
    if (!motivoAdopcion.trim()) {
      setError("Debe ingresar motivo de adopción");
      return;
    }

    const telefonoRegex = /^\+\d{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      setError("Debes incluir prefijo nacional y sin espacios");
      return;
    }

    if (edad < 18 || edad > 100) {
      setError("Debes ser mayor de 18");
      return;
    }

    if (
      experienciaMascotas === "Si" &&
      (cantidadMascotas < 0 || cantidadMascotas > 20)
    ) {
      setError("Cantidad de mascotas debe estar entre 0 y 20");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateAdoptante(rutActual!, {
        rut: adoptanteRut.toLowerCase(),
        nombre,
        edad,
        telefono,
        direccion,
        comuna,
        latitud: latitud ?? undefined,
        longitud: longitud ?? undefined,
        experiencia_mascotas: experienciaMascotas,
        cantidad_mascotas: experienciaMascotas === "Si" ? cantidadMascotas : 0,
        especie_preferida: especiePreferida,
        tipo_vivienda: tipoVivienda,
        sexo,
        edad_buscada: edadBuscada,
        motivo_adopcion: motivoAdopcion,
      });

      await AsyncStorage.removeItem("goToFormulario");
      setRedirect(null);
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);

      await deleteUsuario(user.id);

      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("goToFormulario");

      onCancel();
    } catch (err) {
      console.error("Error al cancelar el formulario:", err);
    }
  };

  const handleComunaChange = async (text: string) => {
    setComuna(text);
    setComunaSeleccionada(null);

    if (text.trim().length < 3) {
      setSugerenciasComuna([]);
      return;
    }

    setLoadingComuna(true);
    try {
      const results = await buscarDirecciones(text);
      setSugerenciasComuna(results);
    } catch {
      setSugerenciasComuna([]);
    } finally {
      setLoadingComuna(false);
    }
  };

  const handleSelectComuna = (dir: Direccion) => {
    setComuna(dir.comuna);
    setLatitud(dir.latitud);
    setLongitud(dir.longitud);
    setSugerenciasComuna([]);
    setComunaSeleccionada(dir.comuna);
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={theme.colors.secondary}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      />
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 26,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              width: CARD_WIDTH,
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.accent,
            },
          ]}
        >
          {/* ------------ CAMPOS ------------ */}

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Rut:
          </Text>
          <TextInput
            value={adoptanteRut ?? ""}
            onChangeText={(t) => {
              const soloNumeros = t.replace(/[^0-9kK]/g, "");
              setAdoptanteRut(soloNumeros);
            }}
            placeholder="rut sin punto ni guion"
            style={[styles.input, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.text}
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Nombre:
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            style={[styles.input, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.text}
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Dirección:
          </Text>
          <TextInput
            value={direccion}
            onChangeText={setDireccion}
            placeholder="Dirección"
            style={[styles.input, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.text}
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Comuna:
          </Text>
          <TextInput
            value={comuna}
            onChangeText={handleComunaChange}
            placeholder="Ingrese comuna"
            style={[styles.input, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.text}
          />

          {loadingComuna && (
            <ActivityIndicator
              size="small"
              color={theme.colors.secondary}
              style={{ marginBottom: 8 }}
            />
          )}

          {sugerenciasComuna.length > 0 && (
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.colors.accent,
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              {sugerenciasComuna.slice(0, 3).map((dir, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectComuna(dir)}
                  style={{
                    padding: 10,
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderColor: theme.colors.accent,
                  }}
                >
                  <Text style={{ color: theme.colors.text }}>
                    {dir.comuna}
                    {dir.ciudad ? `, ${dir.ciudad}` : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Teléfono:
          </Text>
          <TextInput
            value={telefono}
            onChangeText={(t) =>
              setTelefono(t.replace(/[^0-9+]/g, ""))
            }
            placeholder="+56912345678"
            keyboardType="phone-pad"
            style={[styles.input, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.text}
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Edad:
          </Text>
          <TextInput
            value={edad.toString()}
            onChangeText={(t) =>
              setEdad(t.replace(/[^0-9]/g, "") ? Number(t) : 0)
            }
            keyboardType="number-pad"
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Edad"
            placeholderTextColor={theme.colors.text}
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            ¿Tienes experiencia con mascotas?
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {["Si", "No"].map((op) => (
              <TouchableOpacity
                key={op}
                onPress={() => setExperienciaMascotas(op as "Si" | "No")}
                style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: theme.colors.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {experienciaMascotas === op && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: theme.colors.secondary,
                      }}
                    />
                  )}
                </View>
                <Text style={{ marginLeft: 6, color: theme.colors.secondary }}>
                  {op}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {experienciaMascotas === "Si" && (
            <>
              <Text style={[styles.label, { color: theme.colors.secondary }]}>
                Cuántas mascotas tiene:
              </Text>
              <TextInput
                value={cantidadMascotas.toString()}
                onChangeText={(t) =>
                  setCantidadMascotas(
                    t.replace(/[^0-9]/g, "") ? Number(t) : 0
                  )
                }
                keyboardType="number-pad"
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Cantidad"
                placeholderTextColor={theme.colors.text}
              />
            </>
          )}

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Especie preferida:
          </Text>
          <Picker
            selectedValue={especiePreferida}
            onValueChange={(v) => setEspeciePreferida(v)}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                color: theme.colors.text,
              },
            ]}
          >
            {Object.values(EspeciePreferida).map((e) => (
              <Picker.Item key={e} label={e} value={e} />
            ))}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Tipo de vivienda:
          </Text>
          <Picker
            selectedValue={tipoVivienda}
            onValueChange={(v) => setTipoVivienda(v)}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                color: theme.colors.text,
              },
            ]}
          >
            {Object.values(Vivienda).map((v) => (
              <Picker.Item key={v} label={v} value={v} />
            ))}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Sexo:
          </Text>
          <Picker
            selectedValue={sexo}
            onValueChange={(v) => setSexo(v)}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                color: theme.colors.text,
              },
            ]}
          >
            {Object.values(Sexo).map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Edad buscada:
          </Text>
          <Picker
            selectedValue={edadBuscada}
            onValueChange={(v) => setEdadBuscada(v)}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                color: theme.colors.text,
              },
            ]}
          >
            {Object.values(Edad).map((e) => (
              <Picker.Item key={e} label={e} value={e} />
            ))}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Motivo de adopción:
          </Text>
          <TextInput
            value={motivoAdopcion}
            onChangeText={setMotivoAdopcion}
            multiline
            numberOfLines={3}
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Me gustaría adoptar porque..."
            placeholderTextColor={theme.colors.text}
          />

          {error && (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          {/* BOTONES */}
          <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={[
                styles.button,
                {
                  flex: 1,
                  backgroundColor: theme.colors.backgroundTertiary,
                },
              ]}
            >
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
                {saving ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              style={[
                styles.button,
                { flex: 1, backgroundColor: theme.colors.error },
              ]}
            >
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }
      : {}),
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 16,
    borderRadius: 10,
    minHeight: 46,
  },
  error: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

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
import { useAuth } from "../../hooks/useAuth";
import { buscarDirecciones, Direccion } from "../../services/mapBox";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const MAX_CARD_WIDTH = 480;

const FORM_CARD_WIDTH =
  width <= 480
    ? width * 0.92
    : width <= 840
    ? Math.min(width * 0.8, MAX_CARD_WIDTH)
    : MAX_CARD_WIDTH;

type RootStackParamList = {
  EditarAdoptante: { perfilData: any };
};

type EditarAdoptanteRouteProp = RouteProp<
  RootStackParamList,
  "EditarAdoptante"
>;
export default function EditarAdoptante() {
  const route = useRoute<EditarAdoptanteRouteProp>();
  const navigation = useNavigation();
  const { perfilData } = route.params;

  const [rutActual, setRutActual] = useState<string | null>(perfilData.rut);
  const [adoptanteRut, setAdoptanteRut] = useState<string | null>(
    perfilData.rut
  );
  const [nombre, setNombre] = useState(perfilData.nombre);
  const [direccion, setDireccion] = useState(perfilData.direccion);
  const [telefono, setTelefono] = useState(perfilData.telefono);
  const [edad, setEdad] = useState<number>(perfilData.edad);
  const [experienciaMascotas, setExperienciaMascotas] = useState<"Si" | "No">(
    perfilData.experiencia_mascotas ?? "No"
  );
  const [cantidadMascotas, setCantidadMascotas] = useState(
    perfilData.cantidad_mascotas ?? 0
  );
  const [especiePreferida, setEspeciePreferida] = useState<EspeciePreferida>(
    perfilData.especie_preferida ?? EspeciePreferida.CUALQUIERA
  );
  const [tipoVivienda, setTipoVivienda] = useState<Vivienda>(
    perfilData.tipo_vivienda ?? Vivienda.CASA_PATIO
  );
  const [sexo, setSexo] = useState<Sexo>(perfilData.sexo ?? Sexo.CUALQUIERA);
  const [edadBuscada, setEdadBuscada] = useState<Edad>(
    perfilData.edad_buscada ?? Edad.CACHORRO
  );
  const [motivoAdopcion, setMotivoAdopcion] = useState(
    perfilData.motivo_adopcion ?? ""
  );
  const [comuna, setComuna] = useState(perfilData.comuna ?? "");
  const [latitud, setLatitud] = useState<number | undefined>(
    perfilData.latitud
  );
  const [longitud, setLongitud] = useState<number | undefined>(
    perfilData.longitud
  );
  const [comunaSeleccionada, setComunaSeleccionada] = useState<string | null>(
    perfilData.comuna ?? null
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sugerenciasComuna, setSugerenciasComuna] = useState<Direccion[]>([]);
  const [loadingComuna, setLoadingComuna] = useState(false);
  const { theme } = useTheme();

  const handleSave = async () => {
    if (!adoptanteRut) return;

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
    setError(null); // solo reseteamos aquí, justo antes de enviar al backend

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

      navigation.goBack();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 500) {
        setError("RUT ya existente");
      } else {
        setError("Error al guardar cambios");
      }
    } finally {
      setSaving(false);
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
    } catch (err) {
      console.error(err);
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

    console.log("Comuna seleccionada:", dir.comuna);
    console.log("Latitud:", dir.latitud, "Longitud:", dir.longitud);
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
        contentContainerStyle={{ alignItems: "center", padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: FORM_CARD_WIDTH,
              backgroundColor: theme.colors.backgroundSecondary,
              padding: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: theme.colors.accent,
            }}
          >
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
              placeholder="Nombre del adoptante"
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
              <ActivityIndicator size="small" color={theme.colors.secondary} />
            )}

            {sugerenciasComuna.length > 0 && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.accent,
                  borderRadius: 6,
                  maxHeight: 150,
                  marginBottom: 10,
                }}
              >
                {sugerenciasComuna.slice(0, 3).map((dir, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectComuna(dir)}
                    style={{
                      padding: 8,
                      borderBottomWidth:
                        index !== Math.min(sugerenciasComuna.length, 3) - 1
                          ? 1
                          : 0,
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
              onChangeText={(t) => {
                let filtrado = t.replace(/[^0-9+]/g, "");
                setTelefono(filtrado);
              }}
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
              onChangeText={(t) => {
                const soloNumeros = t.replace(/[^0-9]/g, ""); // elimina letras
                setEdad(soloNumeros ? Number(soloNumeros) : 0);
              }}
              placeholder="Edad"
              keyboardType="number-pad"
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.text}
            />

            <Text style={[styles.label, { color: theme.colors.secondary }]}>
              ¿Tienes experiencia con mascotas?
            </Text>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              {["Si", "No"].map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  onPress={() => setExperienciaMascotas(opcion as "Si" | "No")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 20,
                  }}
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
                    {experienciaMascotas === opcion && (
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
                  <Text
                    style={{ marginLeft: 6, color: theme.colors.secondary }}
                  >
                    {opcion}
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
                  onChangeText={(t) => {
                    const soloNumeros = t.replace(/[^0-9]/g, ""); // elimina letras
                    setCantidadMascotas(soloNumeros ? Number(soloNumeros) : 0);
                  }}
                  placeholder="Cantidad"
                  keyboardType="number-pad"
                  style={[styles.input, { color: theme.colors.text }]}
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
              style={[styles.input, { color: theme.colors.primary }]}
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
              style={[styles.input, { color: theme.colors.primary }]}
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
              style={[styles.input, { color: theme.colors.primary }]}
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
              style={[styles.input, { color: theme.colors.primary }]}
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
              placeholder="Me gustaria adoptar porque..."
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.text}
              multiline
              numberOfLines={3}
            />

            {error && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flex: 1,
                    backgroundColor: theme.colors.backgroundTertiary,
                    marginRight: 5,
                  },
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text
                  style={{ color: theme.colors.secondary, fontWeight: "bold" }}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flex: 1,
                    backgroundColor: theme.colors.error,
                    marginLeft: 5,
                  },
                ]}
                onPress={() => navigation.goBack()}
              >
                <Text
                  style={{ color: theme.colors.secondary, fontWeight: "bold" }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 16,
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
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation } from "@react-navigation/native";

import { useTheme } from "../../theme/ThemeContext";
import { updateAdoptante } from "../../services/fetchAdoptante";
import { buscarDirecciones, Direccion } from "../../services/mapBox";
import {
  Edad,
  EspeciePreferida,
  Sexo,
  Vivienda,
} from "../../types/enums";
import { Adoptante } from "../../types/adoptante";

type Params = {
  perfilData: Adoptante;
};

// --------------------------------------------------------
// ESTILO PICKER COMPATIBLE CON TU THEME
// --------------------------------------------------------
const pickerStyle = (theme: any) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.backgroundSecondary,
  color: theme.colors.text,
  borderRadius: 8,
  marginBottom: 12,
});

export default function EditarAdoptante() {
  const route = useRoute();
  const navigation = useNavigation();
  const { perfilData } = route.params as Params;
  const { theme } = useTheme();

  // --------------------------------------------------------
  // ESTADO DEL FORMULARIO
  // --------------------------------------------------------
  const [rut, setRut] = useState(perfilData.rut);
  const rutOriginal = perfilData.rut;

  const [nombre, setNombre] = useState(perfilData.nombre);
  const [direccion, setDireccion] = useState(perfilData.direccion);
  const [telefono, setTelefono] = useState(perfilData.telefono);
  const [edad, setEdad] = useState(perfilData.edad);

  const [experienciaMascotas, setExperienciaMascotas] = useState<"Si" | "No">(
    perfilData.experiencia_mascotas === "Si" ? "Si" : "No"
  );

  const [cantidadMascotas, setCantidadMascotas] = useState(
    perfilData.cantidad_mascotas
  );

  const [especiePreferida, setEspeciePreferida] = useState<EspeciePreferida>(
    perfilData.especie_preferida
  );

  const [tipoVivienda, setTipoVivienda] = useState<Vivienda>(
    perfilData.tipo_vivienda
  );

  const [sexo, setSexo] = useState<Sexo>(perfilData.sexo);

  const [edadBuscada, setEdadBuscada] = useState<Edad>(
    perfilData.edad_buscada
  );

  const [motivoAdopcion, setMotivoAdopcion] = useState(
    perfilData.motivo_adopcion
  );

  // comuna + mapa
  const [comuna, setComuna] = useState(perfilData.comuna ?? "");
  const [latitud, setLatitud] = useState<number | undefined>(
    perfilData.latitud
  );
  const [longitud, setLongitud] = useState<number | undefined>(
    perfilData.longitud
  );

  const [sugerenciasComuna, setSugerenciasComuna] = useState<Direccion[]>([]);
  const [loadingComuna, setLoadingComuna] = useState(false);
  const [comunaValida, setComunaValida] = useState<boolean>(
    !!perfilData.comuna
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------------
  // BUSCAR COMUNA (MAPBOX)
  // --------------------------------------------------------
  const handleComunaChange = async (txt: string) => {
    setComuna(txt);
    setComunaValida(false);

    if (txt.trim().length < 3) {
      setSugerenciasComuna([]);
      return;
    }

    setLoadingComuna(true);
    try {
      const results = await buscarDirecciones(txt);
      setSugerenciasComuna(results);
    } catch {
      setSugerenciasComuna([]);
    } finally {
      setLoadingComuna(false);
    }
  };

  const seleccionarComuna = (dir: Direccion) => {
    setComuna(dir.comuna);
    setLatitud(dir.latitud);
    setLongitud(dir.longitud);
    setSugerenciasComuna([]);
    setComunaValida(true);
  };

  // --------------------------------------------------------
  // VALIDAR Y GUARDAR
  // --------------------------------------------------------
  const guardar = async () => {
    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!/^\d{7,8}[0-9kK]$/.test(rut)) {
      setError("RUT inválido (sin puntos ni guion)");
      return;
    }

    if (!/^\+\d{7,15}$/.test(telefono)) {
      setError("Teléfono inválido (+569...)");
      return;
    }

    if (edad < 18 || edad > 100) {
      setError("Edad inválida");
      return;
    }

    if (cantidadMascotas < 0 || cantidadMascotas > 20) {
      setError("Cantidad de mascotas inválida");
      return;
    }

    if (!comunaValida) {
      setError("Selecciona una comuna válida");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateAdoptante(rutOriginal, {
        rut: rut.toLowerCase(),
        nombre,
        direccion,
        telefono,
        edad,
        comuna,
        latitud,
        longitud,
        experiencia_mascotas: experienciaMascotas,
        cantidad_mascotas:
          experienciaMascotas === "Si" ? cantidadMascotas : 0,
        especie_preferida: especiePreferida,
        tipo_vivienda: tipoVivienda,
        sexo,
        edad_buscada: edadBuscada,
        motivo_adopcion: motivoAdopcion,
      });

      navigation.goBack();
    } catch {
      setError("Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {/* RUT */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              RUT
            </Text>
            <TextInput
              value={rut}
              onChangeText={(t) => setRut(t.replace(/[^0-9kK]/g, ""))}
              placeholder="11222333k"
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            {/* Nombre */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Nombre
            </Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            {/* Dirección */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Dirección
            </Text>
            <TextInput
              value={direccion}
              onChangeText={setDireccion}
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            {/* Comuna */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Comuna
            </Text>
            <TextInput
              value={comuna}
              onChangeText={handleComunaChange}
              placeholder="Ingresa comuna"
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            {loadingComuna && (
              <ActivityIndicator color={theme.colors.accent} />
            )}

            {sugerenciasComuna.length > 0 && (
              <View
                style={[
                  styles.sugBox,
                  { borderColor: theme.colors.border },
                ]}
              >
                {sugerenciasComuna.slice(0, 3).map((dir, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => seleccionarComuna(dir)}
                    style={styles.sugItem}
                  >
                    <Text style={{ color: theme.colors.text }}>
                      {dir.comuna}
                      {dir.ciudad ? ", " + dir.ciudad : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Teléfono */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Teléfono
            </Text>
            <TextInput
              value={telefono}
              onChangeText={(t) => setTelefono(t.replace(/[^0-9+]/g, ""))}
              keyboardType="phone-pad"
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            {/* Edad */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Edad
            </Text>
            <TextInput
              value={edad.toString()}
              onChangeText={(t) =>
                setEdad(Number(t.replace(/[^0-9]/g, "")) || 0)
              }
              keyboardType="number-pad"
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />

            {/* Experiencia mascotas */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              ¿Tienes experiencia con mascotas?
            </Text>

            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              {["Si", "No"].map((op) => (
                <TouchableOpacity
                  key={op}
                  onPress={() => setExperienciaMascotas(op as any)}
                  style={styles.radioRow}
                >
                  <View
                    style={[
                      styles.radio,
                      { borderColor: theme.colors.textSecondary },
                    ]}
                  >
                    {experienciaMascotas === op && (
                      <View
                        style={[
                          styles.radioDot,
                          { backgroundColor: theme.colors.textSecondary },
                        ]}
                      />
                    )}
                  </View>
                  <Text style={{ color: theme.colors.text }}>{op}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {experienciaMascotas === "Si" && (
              <>
                <Text
                  style={[styles.label, { color: theme.colors.textSecondary }]}
                >
                  Cantidad de mascotas
                </Text>
                <TextInput
                  value={cantidadMascotas.toString()}
                  onChangeText={(t) =>
                    setCantidadMascotas(Number(t.replace(/[^0-9]/g, "")) || 0)
                  }
                  keyboardType="number-pad"
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                />
              </>
            )}

            {/* SELECTS */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Especie preferida
            </Text>
            <Picker
              selectedValue={especiePreferida}
              onValueChange={setEspeciePreferida}
              style={pickerStyle(theme)}
            >
              {Object.values(EspeciePreferida).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Tipo de vivienda
            </Text>
            <Picker
              selectedValue={tipoVivienda}
              onValueChange={setTipoVivienda}
              style={pickerStyle(theme)}
            >
              {Object.values(Vivienda).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Sexo
            </Text>
            <Picker
              selectedValue={sexo}
              onValueChange={setSexo}
              style={pickerStyle(theme)}
            >
              {Object.values(Sexo).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Edad buscada
            </Text>
            <Picker
              selectedValue={edadBuscada}
              onValueChange={setEdadBuscada}
              style={pickerStyle(theme)}
            >
              {Object.values(Edad).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            {/* Motivo adopción */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Motivo de adopción
            </Text>
            <TextInput
              value={motivoAdopcion}
              onChangeText={setMotivoAdopcion}
              multiline
              numberOfLines={3}
              style={[
                styles.textarea,
                { color: theme.colors.text, borderColor: theme.colors.border },
              ]}
            />

            {error && (
              <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                {error}
              </Text>
            )}

            {/* BOTONES */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: theme.colors.accent,
                  },
                ]}
                onPress={guardar}
                disabled={saving}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: theme.colors.error },
                ]}
                onPress={() => navigation.goBack()}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --------------------------------------------------------
// ESTILOS
// --------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    padding: 20,
    borderWidth: 2,
    borderRadius: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },

  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    height: 80,
    marginBottom: 12,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },

  radio: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  sugBox: {
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },

  sugItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
});

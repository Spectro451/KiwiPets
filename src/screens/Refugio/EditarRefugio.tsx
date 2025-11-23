import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { updateRefugio } from "../../services/fetchRefugio";
import { useTheme } from "../../theme/ThemeContext";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { buscarDirecciones, Direccion } from "../../services/mapBox";

type RootStackParamList = {
  EditarRefugio: { perfilData: any };
};

type EditarRefugioRouteProp = RouteProp<RootStackParamList, "EditarRefugio">;

const { width } = Dimensions.get("window");
const isSmall = width <= 480;
const isTablet = width > 480 && width <= 840;
const CARD_WIDTH = isSmall
  ? width * 0.92
  : isTablet
  ? Math.min(width * 0.7, 520)
  : 520;

export default function EditarRefugio() {
  const navigation = useNavigation();
  const route = useRoute<EditarRefugioRouteProp>();
  const { perfilData } = route.params;
  const { theme } = useTheme();

  const [nombre, setNombre] = useState(perfilData.nombre);
  const [direccion, setDireccion] = useState(perfilData.direccion);
  const [telefono, setTelefono] = useState(perfilData.telefono);
  const [comuna, setComuna] = useState(perfilData.comuna ?? "");
  const [latitud, setLatitud] = useState<number | undefined>(
    perfilData.latitud
  );
  const [longitud, setLongitud] = useState<number | undefined>(
    perfilData.longitud
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sugerenciasComuna, setSugerenciasComuna] = useState<Direccion[]>([]);
  const [loadingComuna, setLoadingComuna] = useState(false);

  const [comunaSeleccionada, setComunaSeleccionada] = useState<string | null>(
    perfilData.comuna ?? null
  );

  // ---------------- VALIDAR Y GUARDAR ----------------
  const handleSave = async () => {
    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const telefonoRegex = /^\+\d{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      setError("Formato de teléfono inválido. Ej: +56912345678");
      return;
    }

    if (comuna !== comunaSeleccionada) {
      setError("Debes seleccionar una comuna de la lista");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateRefugio(perfilData.id, {
        nombre,
        direccion,
        telefono,
        comuna,
        latitud,
        longitud,
      });

      navigation.goBack();
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- BUSCAR COMUNA ----------------
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

  // ---------------- UI ----------------
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
          paddingHorizontal: isSmall ? 16 : 28,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              width: CARD_WIDTH,
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.backgroundTertiary,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Editar refugio
          </Text>

          {/* Nombre */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Nombre
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del refugio"
            placeholderTextColor={theme.colors.text}
            style={[styles.input, { color: theme.colors.text }]}
          />

          {/* Dirección */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Dirección
          </Text>
          <TextInput
            value={direccion}
            onChangeText={setDireccion}
            placeholder="Dirección exacta"
            placeholderTextColor={theme.colors.text}
            style={[styles.input, { color: theme.colors.text }]}
          />

          {/* Comuna */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Comuna
          </Text>
          <TextInput
            value={comuna}
            onChangeText={handleComunaChange}
            placeholder="Ingresa la comuna"
            placeholderTextColor={theme.colors.text}
            style={[styles.input, { color: theme.colors.text }]}
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
              style={[styles.dropdown, { borderColor: theme.colors.accent }]}
            >
              {sugerenciasComuna.slice(0, 3).map((dir, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectComuna(dir)}
                  style={[
                    styles.dropdownItem,
                    {
                      borderBottomWidth:
                        index < Math.min(3, sugerenciasComuna.length) - 1
                          ? 1
                          : 0,
                      borderColor: theme.colors.accent,
                    },
                  ]}
                >
                  <Text style={{ color: theme.colors.text }}>
                    {dir.comuna}
                    {dir.ciudad ? `, ${dir.ciudad}` : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Teléfono */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Teléfono
          </Text>
          <TextInput
            value={telefono}
            onChangeText={(t) => {
              const limpio = t.replace(/[^0-9+]/g, "");
              setTelefono(limpio);
            }}
            placeholder="+56912345678"
            placeholderTextColor={theme.colors.text}
            keyboardType="phone-pad"
            style={[styles.input, { color: theme.colors.text }]}
          />

          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          {/* Botones */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={[
                styles.btn,
                {
                  backgroundColor: saving
                    ? theme.colors.backgroundTertiary
                    : theme.colors.accent,
                },
              ]}
            >
              <Text style={[styles.btnTxt, { color: theme.colors.secondary }]}>
                {saving ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.btn, { backgroundColor: theme.colors.error }]}
            >
              <Text style={[styles.btnTxt, { color: theme.colors.secondary }]}>
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
      ? {
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        }
      : {}),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 10,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

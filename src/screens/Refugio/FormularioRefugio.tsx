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
} from "react-native";
import { refugioByUsuarioId, updateRefugio } from "../../services/fetchRefugio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../theme/ThemeContext";
import { deleteUsuario } from "../../services/fetchUsuario";
import { buscarDirecciones, Direccion } from "../../services/mapBox";

type FormularioRefugioProps = {
  setRedirect: (val: string | null) => void;
  onCancel: () => void;
};

const { width } = Dimensions.get("window");

const isSmall = width <= 480;
const isTablet = width > 480 && width <= 840;

const FORM_CARD_WIDTH = isSmall
  ? width * 0.92
  : isTablet
  ? Math.min(width * 0.75, 480)
  : 480;

export default function FormularioRefugio({
  setRedirect,
  onCancel,
}: FormularioRefugioProps) {
  const { theme } = useTheme();

  const [refugioId, setRefugioId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comuna, setComuna] = useState("");
  const [latitud, setLatitud] = useState<number | undefined>();
  const [longitud, setLongitud] = useState<number | undefined>();

  const [sugerenciasComuna, setSugerenciasComuna] = useState<Direccion[]>([]);
  const [loadingComuna, setLoadingComuna] = useState(false);
  const [comunaSeleccionada, setComunaSeleccionada] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Cargar refugio por usuario ----
  useEffect(() => {
    const loadRefugio = async () => {
      setLoading(true);

      try {
        const data = await refugioByUsuarioId();
        if (!data) throw new Error("No se encontró refugio");

        setRefugioId(data.id);
        setNombre(data.nombre || "");
        setDireccion(data.direccion || "");
        setTelefono(data.telefono || "");
        setComuna(data.comuna || "");
        setLatitud(data.latitud);
        setLongitud(data.longitud);
      } catch (err: any) {
        setError(err.message || "Error al cargar datos del refugio");
      } finally {
        setLoading(false);
      }
    };

    loadRefugio();
  }, []);

  // ---- Guardar cambios ----
  const handleSave = async () => {
    if (!refugioId) return;

    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const telefonoRegex = /^\+\d{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      setError("Debes incluir prefijo nacional y sin espacios");
      return;
    }

    if (comuna !== comunaSeleccionada) {
      setError("Debes seleccionar una comuna de la lista");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateRefugio(refugioId, {
        nombre,
        direccion,
        telefono,
        comuna,
        latitud,
        longitud,
      });

      await AsyncStorage.removeItem("goToFormulario");

      setRedirect(null);
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  // ---- Cancelar configuración → elimina usuario ----
  const handleCancel = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);

      await deleteUsuario(user.id);

      await AsyncStorage.multiRemove(["user", "token", "goToFormulario"]);

      onCancel();
    } catch (err) {
      console.error("Error al cancelar el formulario:", err);
    }
  };

  // ---- Buscar comuna ----
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
        color={theme.colors.accent}
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
        }}
      />
    );

  return (
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
          Nombre:
        </Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del refugio"
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
                    index !== Math.min(sugerenciasComuna.length, 3) - 1 ? 1 : 0,
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
          onChangeText={(t) => setTelefono(t.replace(/[^0-9+]/g, ""))}
          placeholder="+56912345678"
          keyboardType="phone-pad"
          style={[styles.input, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.text}
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
            <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
              {saving ? "Guardando..." : "Guardar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { flex: 1, backgroundColor: theme.colors.error, marginLeft: 5 },
            ]}
            onPress={handleCancel}
          >
            <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  error: {
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

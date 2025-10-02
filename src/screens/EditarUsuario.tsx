import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../theme/ThemeContext";
import { getUsuarioId, updateUsuario } from "../services/fetchUsuario";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);

export default function EditarUsuario() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const correoRef = useRef<TextInput>(null);
  const contraseñaRef = useRef<TextInput>(null);

  // Traer datos desde backend usando el user.id del AsyncStorage
  useEffect(() => {
    const loadUsuario = async () => {
      try {
        setLoading(true);
        const userStr = await AsyncStorage.getItem("user");
        if (!userStr) throw new Error("No hay usuario logueado");
        const user = JSON.parse(userStr);

        const data = await getUsuarioId(user.id);
        if (!data) throw new Error("No se pudo cargar el usuario");

        setCorreo(data.correo);
      } catch (err: any) {
        setError(err.message || "Error al cargar usuario");
      } finally {
        setLoading(false);
      }
    };
    loadUsuario();
  }, []);

  const handleSave = async () => {
    if (!correo.includes("@")) {
      setError("Correo inválido");
      correoRef.current?.focus();
      return;
    }
    if (contraseña && contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      contraseñaRef.current?.focus();
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) throw new Error("No hay usuario logueado");
      const user = JSON.parse(userStr);

      await updateUsuario(user.id, { correo, ...(contraseña ? { contraseña } : {}) });
      alert("Usuario actualizado correctamente");
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || "Error al actualizar usuario");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={theme.colors.secondary} style={{ flex: 1, backgroundColor: theme.colors.background }} />;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
      <View style={{
        width: FORM_CARD_WIDTH,
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.accent,
      }}>
        <Text style={[styles.label, { color: theme.colors.secondary }]}>Correo:</Text>
        <TextInput
          ref={correoRef}
          value={correo}
          onChangeText={setCorreo}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.text}
        />

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Contraseña:</Text>
        <TextInput
          ref={contraseñaRef}
          value={contraseña}
          onChangeText={setContraseña}
          placeholder="Contraseña (deje en blanco para no cambiar)"
          secureTextEntry
          autoCapitalize="none"
          style={[styles.input, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.text}
        />

        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: theme.colors.backgroundTertiary, marginRight: 5 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
                {saving ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: theme.colors.error, marginLeft: 5 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Cancelar</Text>
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

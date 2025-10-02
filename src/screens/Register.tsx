import { Dispatch, SetStateAction, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Platform, TouchableOpacity } from "react-native";
import { createUsuario, loginUsuario } from "../services/fetchUsuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../theme/ThemeContext";
import { Picker } from '@react-native-picker/picker';


type RegisterProps = NativeStackScreenProps<any> & {
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<{ id: number; tipo: string; admin: boolean } | null>>;
};

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);

export default function RegisterScreen({ setToken, setUser}: RegisterProps) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const correoRef = useRef<TextInput>(null);
  const contraseñaRef = useRef<TextInput>(null);
  const [selectedTipo, setSelectedTipo] = useState<'Adoptante' | 'Refugio'>('Adoptante');

  const handleRegister = async () => {
    setError(null);

    // Validaciones
    if (!correo.includes("@")) {
      setError("Correo inválido");
      correoRef.current?.focus();
      return;
    }
    if (contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      contraseñaRef.current?.focus();
      return;
    }

    try {
      setLoading(true);

      // Crear usuario como Adoptante
      const nuevoUsuario = await createUsuario({ correo, contraseña, tipo: selectedTipo  });
      if (!nuevoUsuario) throw new Error("Error al crear usuario");

      // Login inmediato
      const loginData = await loginUsuario(correo, contraseña);
      if (!loginData?.token) {
        setError("Error al hacer login");
      return;
      }

      // Guardar token y user en AsyncStorage
      await AsyncStorage.setItem("token", loginData.token);
      await AsyncStorage.setItem("user", JSON.stringify({
        id: loginData.id,
        tipo: loginData.tipo,
        admin: loginData.admin
      }));
      await AsyncStorage.setItem("goToFormulario", "true");

      // Setear en useAuth
      setToken(loginData.token);
      setUser({
        id: loginData.id,
        tipo: loginData.tipo,
        admin: loginData.admin
      });

    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

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
          style={[styles.input, { color: theme.colors.text }, error?.includes("correo") && { borderColor: theme.colors.error }]}
          placeholderTextColor={theme.colors.text}
        />

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Contraseña:</Text>
        <TextInput
          ref={contraseñaRef}
          value={contraseña}
          onChangeText={setContraseña}
          placeholder="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          style={[styles.input, { color: theme.colors.text }, error?.includes("contraseña") && { borderColor: theme.colors.error }]}
          placeholderTextColor={theme.colors.text}
        />

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Tipo de usuario:</Text>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          {["Adoptante", "Refugio"].map((tipo) => (
            <TouchableOpacity
              key={tipo}
              onPress={() => setSelectedTipo(tipo as "Adoptante" | "Refugio")}
              style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: theme.colors.secondary,
                alignItems: "center",
                justifyContent: "center",
              }}>
                {selectedTipo === tipo && (
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: theme.colors.secondary,
                  }}/>
                )}
              </View>
              <Text style={{ marginLeft: 6, color: theme.colors.secondary }}>{tipo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
            {loading ? "Registrando..." : "Registrarse"}
          </Text>
        </TouchableOpacity>
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


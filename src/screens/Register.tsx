import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { createUsuario, loginUsuario } from "../services/fetchUsuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../theme/ThemeContext";

type RegisterProps = NativeStackScreenProps<any> & {
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<
    SetStateAction<{ id: number; tipo: string; admin: boolean } | null>
  >;
};

const { width } = Dimensions.get("window");
const isSmall = width <= 480;
const isTablet = width > 480 && width <= 840;
const CARD_WIDTH = isSmall
  ? width * 0.92
  : isTablet
  ? Math.min(width * 0.7, 520)
  : 520;

export default function RegisterScreen({
  setToken,
  setUser,
  navigation,
}: RegisterProps) {
  const { theme } = useTheme();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<
    "Adoptante" | "Refugio"
  >("Adoptante");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const correoRef = useRef<TextInput>(null);
  const contraseñaRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    setError(null);

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(correo)) {
      setError("Debe ingresar un correo válido");
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

      const nuevoUsuario = await createUsuario({
        correo,
        contraseña,
        tipo: selectedTipo,
      });

      if (!nuevoUsuario) {
        setError("Error al crear usuario");
        return;
      }

      const loginData = await loginUsuario(correo, contraseña);
      if (!loginData?.token) {
        setError("Error al hacer login");
        return;
      }

      await AsyncStorage.setItem("token", loginData.token);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          id: loginData.id,
          tipo: loginData.tipo,
          admin: loginData.admin,
        })
      );
      await AsyncStorage.setItem("goToFormulario", "true");

      setToken(loginData.token);
      setUser({
        id: loginData.id,
        tipo: loginData.tipo,
        admin: loginData.admin,
      });
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

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
              borderColor: theme.colors.accent,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Registro
          </Text>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Correo
          </Text>
          <TextInput
            ref={correoRef}
            value={correo}
            onChangeText={setCorreo}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={theme.colors.text}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              { color: theme.colors.text },
              error?.includes("correo") && {
                borderColor: theme.colors.error,
              },
            ]}
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Contraseña
          </Text>
          <TextInput
            ref={contraseñaRef}
            value={contraseña}
            onChangeText={setContraseña}
            placeholder="Contraseña"
            placeholderTextColor={theme.colors.text}
            secureTextEntry
            autoCapitalize="none"
            style={[
              styles.input,
              { color: theme.colors.text },
              error?.includes("contraseña") && {
                borderColor: theme.colors.error,
              },
            ]}
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>
            Tipo de usuario
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {["Adoptante", "Refugio"].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                onPress={() =>
                  setSelectedTipo(tipo as "Adoptante" | "Refugio")
                }
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
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedTipo === tipo && (
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
                  style={{
                    marginLeft: 6,
                    color: theme.colors.secondary,
                  }}
                >
                  {tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <Text
              style={[styles.error, { color: theme.colors.error }]}
            >
              {error}
            </Text>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    theme.colors.backgroundTertiary,
                },
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text
                style={{
                  color: theme.colors.secondary,
                  fontWeight: "bold",
                }}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.colors.error,
                },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  color: theme.colors.secondary,
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
  error: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

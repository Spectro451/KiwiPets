import { Dispatch, SetStateAction, useRef, useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from "react-native";
import { createUsuario, loginUsuario } from "../services/fetchUsuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RegisterProps = NativeStackScreenProps<any> & {
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<{ id: number; tipo: string; admin: boolean } | null>>;
};

export default function RegisterScreen({ setToken, setUser, navigation }: RegisterProps) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const correoRef = useRef<TextInput>(null);
  const contraseñaRef = useRef<TextInput>(null);

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
      const nuevoUsuario = await createUsuario({ correo, contraseña, tipo: "Refugio" });
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

      if (loginData.tipo === "Refugio") {
        navigation.replace("FormularioRefugio");
      } else if (loginData.tipo === "Adoptante") {
        navigation.replace("FormularioAdoptante");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Correo:</Text>
      <TextInput
        ref={correoRef}
        value={correo}
        onChangeText={setCorreo}
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, error?.includes("correo") && styles.errorInput]}
      />

      <Text>Contraseña:</Text>
      <TextInput
        ref={contraseñaRef}
        value={contraseña}
        onChangeText={setContraseña}
        placeholder="Contraseña"
        secureTextEntry
        style={[styles.input, error?.includes("contraseña") && styles.errorInput]}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Registrarse" onPress={handleRegister} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginBottom: 10 },
});

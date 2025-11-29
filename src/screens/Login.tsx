import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/fetchUsuario';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';

type LoginProps = NativeStackScreenProps<any> & {
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<{ id: number; tipo: string; admin: boolean } | null>>;
};

const { width } = Dimensions.get("window");

const isSmall = width <= 480;
const isTablet = width > 480 && width <= 840;

const FORM_CARD_WIDTH = isSmall
  ? width * 0.92
  : isTablet
  ? Math.min(width * 0.7, 480)
  : 480;

export default function LoginScreen  ({ setToken, setUser, navigation }: LoginProps) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const { theme } = useTheme();
    const correoRef = useRef<TextInput>(null);
    const contraseñaRef = useRef<TextInput>(null);
  const [error, setError] = useState<string>("");


  const handleLogin = async () => {
    if (loadingLogin) return;
    if (!email.trim()) {
      setError("Debe ingresar un correo");
      correoRef.current?.focus();
      return;
    }

    if (!contraseña.trim()) {
      setError("Debe ingresar una contraseña");
      return;
    }
    setLoadingLogin(true);
    try {
      //const data = await loginUsuario(email, contraseña);
      //if (!data?.token) {
        //setError(data?.message || "Correo o contraseña incorrectos");
        //return;
      //}
      
      // 🔥 MODO OFFLINE TEMPORAL — LOGIN SIN BACKEND
let data: any;

if (true) {  // <-- puedes poner una variable aquí si quieres activar/desactivar
  data = {
    token: "fake-token-123",
    id: 1,
    tipo: "usuario",
    admin: true,
  };
} else {
  data = await loginUsuario(email, contraseña);
}


      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({ id: data.id, tipo: data.tipo, admin: data.admin })
      );

      // Le mando los datos y el token al app.tsx
      setToken(data.token);
      setUser({ id: data.id, tipo: data.tipo, admin: data.admin });
    } catch (err: any) {
        setError(err.response?.data?.message || "Error de conexión");
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor:theme.colors.background, justifyContent:"center", alignItems: "center",  }}>
      <View style = {{
        width: FORM_CARD_WIDTH,
        backgroundColor:theme.colors.backgroundSecondary,
        padding:20,
        borderRadius:10,
        borderWidth:2,
        borderColor:theme.colors.accent,
      }}>
        <Text style={[styles.label, { color: theme.colors.secondary }]}>Correo:</Text>
        <TextInput
          value={email}
          ref={correoRef}
          onChangeText={setEmail}
          placeholder="Correo"
          style={[styles.input, { color: theme.colors.text }, error?.includes("ingresar un correo") && { borderColor: theme.colors.error }]}
          placeholderTextColor={theme.colors.text}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next" 
        />
        <Text style={[styles.label, { color: theme.colors.secondary }]}>Contraseña:</Text>
        <TextInput
          value={contraseña}
          ref={contraseñaRef}
          onChangeText={setContraseña}
          placeholder="Contraseña"
          style={[styles.input, { color: theme.colors.text }, error?.includes("ingresar una contraseña") && { borderColor: theme.colors.error }]}
          placeholderTextColor={theme.colors.text}
          secureTextEntry
          autoCapitalize="none"
          onSubmitEditing={handleLogin}
        />
        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]}
          onPress={handleLogin}
          disabled={loadingLogin}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
            {loadingLogin ? "Ingresando..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 15 }}>
          <Text style={{ color: theme.colors.secondary, textAlign: 'center' }}>
            ¿No tienes cuenta? Regístrate
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
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    textAlign: "center",
    marginBottom: 10,
  },
});

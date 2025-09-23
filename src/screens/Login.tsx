import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/fetchUsuario';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type LoginProps = NativeStackScreenProps<any> & {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<
    React.SetStateAction<{ id: number; tipo: string; admin: boolean } | null>
  >;
};

const LoginScreen = ({ setToken, setUser, navigation }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleLogin = async () => {
    if (loadingLogin) return;
    setLoadingLogin(true);
    try {
      const data = await loginUsuario(email, password); // asegúrate que fetch use { correo, contraseña } si tu backend lo pide
      if (!data?.token) {
        Alert.alert('Login fallido', data?.message || 'Correo o contraseña incorrectos');
        return;
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({ id: data.id, tipo: data.tipo, admin: data.admin })
      );

      // Actualizamos la instancia que App.tsx está usando
      setToken(data.token);
      setUser({ id: data.id, tipo: data.tipo, admin: data.admin });
      // NO navigation.replace aquí: App.tsx cambiará automáticamente a BottomTabs
    } catch (err: any) {
      console.error('login error', err);
      Alert.alert('Error', err.response?.data?.message || 'Error de conexión');
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Correo" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {loadingLogin ? <ActivityIndicator /> : <Button title="Login" onPress={handleLogin} />}
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 15 }}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});

export default LoginScreen;

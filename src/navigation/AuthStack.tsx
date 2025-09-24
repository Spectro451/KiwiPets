import { Dispatch, SetStateAction } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';

type AuthStackProps = {
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<
    SetStateAction<{ id: number; tipo: string; admin: boolean } | null>
  >;
};

const Stack = createNativeStackNavigator();

export default function AuthStack({ setToken, setUser }: AuthStackProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} setToken={setToken} setUser={setUser} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {props => <RegisterScreen {...props} setToken={setToken} setUser={setUser} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
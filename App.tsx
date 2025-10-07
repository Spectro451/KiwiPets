import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import BottomTabs from "./src/navigation/Tabs";
import AuthStack from "./src/navigation/AuthStack";
import { useAuth } from './src/hooks/useAuth';
import {NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormularioRefugio from "./src/screens/Refugio/FormularioRefugio";
import FormularioAdoptante from "./src/screens/Adoptante/FormularioAdoptante";
import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetalleAdopcion from "./src/screens/Refugio/Detalles";
import EditarAdoptante from "./src/screens/Adoptante/EditarAdoptante";
import EditarRefugio from "./src/screens/Refugio/EditarRefugio";
import EditarUsuario from "./src/screens/EditarUsuario";
import MisMascotasScreen from "./src/screens/Refugio/MisMascotas";
import AgregarMascotaScreen from "./src/screens/Refugio/AgregarMascota";
import EditarMascotaScreen from "./src/screens/Refugio/EditarMascota";
import BorrarMascotaScreen from "./src/screens/Refugio/BorrarMascota";
import FormularioEditarMascotaScreen from "./src/screens/Refugio/FormularioEditarMascota";
import { transferirMascotas } from "./src/services/fetchMascotas";
import TransferirMascotas from "./src/screens/Refugio/Transferir";
import SeleccionarRefugioScreen from "./src/screens/Refugio/SeleccionRefugios";

const TempStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

export default function App() {
  const auth = useAuth();
  const [redirect, setRedirect] = useState<string | null>(null);
  const {theme} = useTheme(); 
  const [navKey, setNavKey] = useState(0);

  const handleLogout = async () => {
    await AsyncStorage.clear(); 
    auth.setToken(null);
    auth.setUser(null);
    setRedirect(null);
    setNavKey(k => k + 1); 
  };

  // Revisar si hay que ir al formulario post-register
  useEffect(() => {
    const checkRedirect = async () => {
      if (!auth.user) return;
      const flag = await AsyncStorage.getItem("goToFormulario");
      if (flag === "true") {
        await AsyncStorage.removeItem("goToFormulario");
        setRedirect(auth.user.tipo);
      }
    };
    checkRedirect();
  }, [auth.user]);

  if (auth.loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer key={navKey}>
        {auth.token && auth.user ? (
          redirect ? (
            <TempStack.Navigator screenOptions={{ headerShown: false }}>
              {redirect === "Adoptante" ? (
                <TempStack.Screen name="FormularioAdoptante">
                  {props => <FormularioAdoptante {...props} setRedirect={setRedirect} onCancel={handleLogout} />}
                </TempStack.Screen>
              ) : (
                <TempStack.Screen name="FormularioRefugio">
                  {props => <FormularioRefugio {...props} setRedirect={setRedirect} onCancel={handleLogout} />}
                </TempStack.Screen>
              )}
            </TempStack.Navigator>
          ) : (
            <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
              <RootStack.Screen name="MainTabs">
                {props => <BottomTabs {...props} user={auth.user!} onLogout={handleLogout} />}
              </RootStack.Screen>
              <RootStack.Screen
                name="DetalleAdopcion"
                component={DetalleAdopcion}
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="EditarPerfilAdoptante"
                component={EditarAdoptante}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="EditarPerfilRefugio"
                component={EditarRefugio}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="EditarUsuario"
                component={EditarUsuario}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="MisMascotas"
                component={MisMascotasScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="AgregarMascota"
                component={AgregarMascotaScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="EditarMascota"
                component={EditarMascotaScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="BorrarMascota"
                component={BorrarMascotaScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="FormularioEditarMascota"
                component={FormularioEditarMascotaScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="TransferirMascotas"
                component={TransferirMascotas}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />
              <RootStack.Screen
                name="SeleccionarRefugio"
                component={SeleccionarRefugioScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: theme.colors.background }
                }}
              />              
            </RootStack.Navigator>
          )
        ) : (
          <AuthStack setToken={auth.setToken} setUser={auth.setUser} />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}
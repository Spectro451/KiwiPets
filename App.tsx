import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import BottomTabs from "./src/navigation/Tabs";
import AuthStack from "./src/navigation/AuthStack";
import { useAuth } from './src/hooks/useAuth';
import {NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormularioRefugio from "./src/screens/Refugio/FormularioRefugio";
import FormularioAdoptante from "./src/screens/Adoptante/FormularioAdoptante";
import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DetalleAdopcion from "./src/screens/Refugio/Detalles";
import { darkTheme } from "./src/theme/theme";

const TempStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

export default function App() {
  const auth = useAuth();
  const [redirect, setRedirect] = useState<string | null>(null);
  const {theme} = useTheme(); 

  // Revisar si hay que ir al formulario post-register
  useEffect(() => {
    const checkRedirect = async () => {
      if (!auth.user) return;
      const flag = await AsyncStorage.getItem("goToFormulario");
      if (flag === "true") {
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
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
        <StatusBar
          style={theme === darkTheme ? 'light' : 'dark'}
          backgroundColor={theme.colors.background}
          translucent={false}
          hidden={false}
        />
          <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
            {auth.token && auth.user ? (
              redirect ? (
                <TempStack.Navigator screenOptions={{ headerShown: false }}>
                  {redirect === "Adoptante" ? (
                    <TempStack.Screen name="FormularioAdoptante">
                      {props => <FormularioAdoptante {...props} setRedirect={setRedirect} />}
                    </TempStack.Screen>
                  ) : (
                    <TempStack.Screen name="FormularioRefugio">
                      {props => <FormularioRefugio {...props} setRedirect={setRedirect} />}
                    </TempStack.Screen>
                  )}
                </TempStack.Navigator>
              ) : (
                <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle:{backgroundColor:theme.colors.background}}}>
                  <RootStack.Screen name="MainTabs">
                    {props => <BottomTabs {...props} user={auth.user!} />}
                  </RootStack.Screen>
                  <RootStack.Screen
                    name="DetalleAdopcion"
                    component={DetalleAdopcion}
                    options={{
                      headerShown: false,
                      title: "Detalle de Adopción",
                      animation:'slide_from_right',
                      contentStyle:{backgroundColor:theme.colors.background}
                    }}
                  /> 
                </RootStack.Navigator>
              )
            ) : (
              <AuthStack setToken={auth.setToken} setUser={auth.setUser} />
            )}
          </SafeAreaView>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
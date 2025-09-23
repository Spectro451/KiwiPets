import { ThemeProvider } from "./src/theme/ThemeContext";
import BottomTabs from "./src/navigation/Tabs";
import AuthStack from "./src/navigation/AuthStack";
import { useAuth } from './src/hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormularioAdoptante from "./src/screens/FormularioAdoptante";
import FormularioRefugio from "./src/screens/FormularioRefugio";
import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const TempStack = createNativeStackNavigator();

export default function App() {
  const auth = useAuth();
  const [redirect, setRedirect] = useState<string | null>(null);

  // Revisar si hay que ir al formulario post-register
  useEffect(() => {
    const checkRedirect = async () => {
      if (!auth.user) return;
      const flag = await AsyncStorage.getItem("goToFormulario");
      if (flag === "true") {
        await AsyncStorage.removeItem("goToFormulario");
        setRedirect(auth.user.tipo); // "Adoptante" o "Refugio"
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
      <NavigationContainer>
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
            <BottomTabs user={auth.user} />
          )
        ) : (
          <AuthStack setToken={auth.setToken} setUser={auth.setUser} />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}

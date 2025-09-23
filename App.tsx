import { ThemeProvider } from "./src/theme/ThemeContext";
import BottomTabs from "./src/navigation/Tabs";
import AuthStack from "./src/navigation/AuthStack";
import { useAuth } from './src/hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const auth = useAuth(); // <-- UNA sola instancia aquí

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
        {auth.token ? (
          <BottomTabs />
        ) : (
          <AuthStack setToken={auth.setToken} setUser={auth.setUser} />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}

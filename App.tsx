import { ThemeProvider } from "./src/theme/ThemeContext";
import BottomTabs from "./src/navigation/Tabs";
import AuthStack from './src/navigation/AuthStack';
import { useAuth } from './src/hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const { token } = useAuth();

  return (
    <ThemeProvider>
      <NavigationContainer>
        {/* Línea que comprueba si hay token */}
        {/* token ? <BottomTabs /> : <AuthStack /> */}

        {/* Línea para pruebas: forzar que siempre vaya a BottomTabs */}
        <BottomTabs />
      </NavigationContainer>
    </ThemeProvider>
  );
}

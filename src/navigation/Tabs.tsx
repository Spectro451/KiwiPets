import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Adoptante/Home';
import FavScreen from '../screens/Adoptante/Favoritos';
import NotificationScreen from '../screens/Notificaciones';
import ProfileScreen from '../screens/Profile';
import { useTheme } from '../theme/ThemeContext';
import AdopcionesScreen from '../screens/Adoptante/Adopciones';
import Solicitudes from '../screens/Refugio/Solicitudes';

const Tab = createBottomTabNavigator();

interface BottomTabsProps {
  user: { id: number; tipo: string; admin: boolean };
}

export default function BottomTabs({ user }: BottomTabsProps) {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.background, borderTopWidth: 0 },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.overlayTextShadow,
      }}
    >
      {user.tipo === "Adoptante" ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Favoritos" component={FavScreen} />
          <Tab.Screen name="Adopciones" component={AdopcionesScreen} />
          <Tab.Screen name="Notificaciones" component={NotificationScreen} />
          <Tab.Screen name="Perfil" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Solicitudes" component={Solicitudes} />
          <Tab.Screen name="Notificaciones" component={NotificationScreen} />
          <Tab.Screen name="Perfil" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

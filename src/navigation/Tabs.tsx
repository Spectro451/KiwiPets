import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Adoptante/Home';
import FavScreen from '../screens/Adoptante/Favoritos';
import NotificationScreen from '../screens/Notificaciones';
import ProfileScreen from '../screens/Profile';
import { useTheme } from '../theme/ThemeContext';
import AdopcionesScreen from '../screens/Adoptante/Adopciones';
import Solicitudes from '../screens/Refugio/Solicitudes';
import MascotasScreen from '../screens/Refugio/Mascotas';
import ValidarRefugioScreen from '../screens/ValidarRefugio';

const Tab = createBottomTabNavigator();

interface BottomTabsProps {
  user: { id: number; tipo: string; admin: boolean };
  onLogout?: () => Promise<void>;
}



export default function BottomTabs({ user, onLogout }: BottomTabsProps) {
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
          {user.admin && (
            <Tab.Screen
              name="Validar"
              children={(props) => <ValidarRefugioScreen {...props} user={user} />}
            />
          )}
          <Tab.Screen
            name="Perfil"
            children={(props) => <ProfileScreen {...props} route={{ params: { onLogout } }} />}
          />
        </>
      ) : (
        <>
          <Tab.Screen name="Mascotas" component={MascotasScreen} />
          <Tab.Screen name="Solicitudes" component={Solicitudes} />
          <Tab.Screen name="Notificaciones" component={NotificationScreen} />
          {user.admin && (
            <Tab.Screen
              name="Validar"
              children={(props) => <ValidarRefugioScreen {...props} user={user} />}
            />
          )}
          <Tab.Screen
            name="Perfil"
            children={(props) => <ProfileScreen {...props} route={{ params: { onLogout } }} />}
          /> 
        </>
      )}
    </Tab.Navigator>
  );
}

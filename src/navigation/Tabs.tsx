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
import { Ionicons } from '@expo/vector-icons';

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
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.overlayTextShadow,
      }}
    >
      {user.tipo === "Adoptante" ? (
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Favoritos"
            component={FavScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Adopciones"
            component={AdopcionesScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="file-tray-full-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Notificaciones"
            component={NotificationScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="notifications-outline" color={color} size={size} />
              ),
            }}
          />

          {user.admin && (
            <Tab.Screen
              name="Validar"
              children={(props) => (
                <ValidarRefugioScreen {...props} user={user} />
              )}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="checkmark-done-circle-outline" color={color} size={size} />
                ),
              }}
            />
          )}

          <Tab.Screen
            name="Perfil"
            children={(props) => (
              <ProfileScreen {...props} route={{ params: { onLogout } }} />
            )}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-circle-outline" color={color} size={size} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Mascotas"
            component={MascotasScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="paw-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Solicitudes"
            component={Solicitudes}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="swap-vertical-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Notificaciones"
            component={NotificationScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="notifications-outline" color={color} size={size} />
              ),
            }}
          />

          {user.admin && (
            <Tab.Screen
              name="Validar"
              children={(props) => (
                <ValidarRefugioScreen {...props} user={user} />
              )}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="shield-checkmark-outline" color={color} size={size} />
                ),
              }}
            />
          )}

          <Tab.Screen
            name="Perfil"
            children={(props) => (
              <ProfileScreen {...props} route={{ params: { onLogout } }} />
            )}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-circle-outline" color={color} size={size} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

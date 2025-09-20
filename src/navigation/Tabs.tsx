import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/Home';
import FavScreen from '../screens/Favoritos';
import NotificationScreen from '../screens/Notificaciones';
import ProfileScreen from '../screens/Profile';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { theme } = useTheme();
  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: theme.colors.background, borderTopWidth: 0,},
          tabBarActiveTintColor: theme.colors.secondary,
          tabBarInactiveTintColor: theme.colors.overlayTextShadow,
          
        }}
      >
        <Tab.Screen name='Home' component={HomeScreen}/>
        <Tab.Screen name='Favoritos' component={FavScreen}/>
        <Tab.Screen name='Notificaciones' component={NotificationScreen}/>
        <Tab.Screen name='Perfil' component={ProfileScreen}/>
      </Tab.Navigator>
  );
}
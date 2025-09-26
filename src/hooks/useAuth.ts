import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode"
import { AppState, Platform } from "react-native";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{id:number;tipo:string;admin:boolean} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const payload = jwtDecode<{ exp: number }>(storedToken);
          const ahora = Math.floor(Date.now() / 1000);

          if (payload.exp < ahora) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setToken(null);
            setUser(null);
          } else {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        } catch (err) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    loadToken();

    if (Platform.OS === "web") {
      const handleFocus = () => loadToken();
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleFocus);

      return () => {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleFocus);
      };
    } else {
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          loadToken();
        }
      });

      return () => subscription.remove();
    }
  }, []);

  return { token, user, loading, setToken, setUser };
};

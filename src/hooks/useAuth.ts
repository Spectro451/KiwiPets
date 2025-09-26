import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode"

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
  }, []);

  useEffect(() => {
    const logoutListener = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("logout", logoutListener);
    return () => {
      window.removeEventListener("logout", logoutListener);
    };
  }, []);

  return { token, user, loading, setToken, setUser };
};

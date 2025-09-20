import { useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(()=> {
    const loadToken = async () =>{
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    loadToken();
  }, []);

  return {token};
}
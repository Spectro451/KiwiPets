import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export const api = axios.create({
  baseURL: "https://kiwipetsbackend.onrender.com",
  timeout:10000,
});

//envia el token al header de cada consulta
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

//interceptor loco para cuando no tenga acceso
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.log("Token inválido o expirado");
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

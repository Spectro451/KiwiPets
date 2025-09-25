import { Usuario } from "../types/usuario";
import { api } from "./api";

export const getUsuario = async () => {
  try {
    const response = await api.get("/usuario");
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return null;
  }
};

export const getUsuarioId = async (id: number) => {
  try {
    const response = await api.get(`/usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
};

export const updateUsuario = async (id: number, data: Partial<Usuario>) => {
  try {
    const response = await api.put(`/usuario/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar usuario:", error);
    return null;
  }
};

export const deleteUsuario = async (id: number) => {
  try {
    const response = await api.delete(`/usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al borrar usuario:", error);
    return null;
  }
};

export const loginUsuario = async (correo: string, contraseña: string) => {
  try {
    const response = await api.post("/usuario/login", { correo, contraseña });
    return response.data;
  } catch (error: any) {
    console.error("Error al hacer login:", error.response?.data || error.message);
    return null;
  }
};

export const createUsuario = async(data:{
  correo: string;
  contraseña: string;
  tipo: 'Adoptante' | 'Refugio';
}) => {
  try{
    const response = await api.post("/usuario", data);
    return response.data;
  } catch(error: any){
    console.error("Error al crear el usuario:", error.response?.data || error.message);
    return null;
  }
};


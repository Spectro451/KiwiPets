import { Adopcion } from "../types/adopcion";
import { api } from "./api";

export const getAdopcion = async () => {
  try {
    const response = await api.get("/adopcion")
    return response.data;
  } catch (error) {
    console.error("Error al obtener adopciones:", error);
    return [];
  }
};

export const getAdopcionId = async (id:number) => {
  try {
    const response = await api.get(`/adopcion/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error al obtener adopcion:", error);
    return [];
  }
};

export const updateAdopcion = async (id: number, data: Partial<Adopcion>) => {
  try {
    const response = await api.put(`/adopcion/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar adopcion:", error);
    return null;
  }
};

export const deleteAdopcion = async (id:number) => {
  try {
    const response = await api.delete(`/adopcion/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error al borrar adopcion:", error);
    return [];
  }
};
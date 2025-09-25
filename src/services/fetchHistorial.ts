import { api } from "./api";
import { Historial } from "../types/historial";

export const getHistorial = async () => {
  try {
    const response = await api.get("/historial");
    return response.data;
  } catch (error) {
    console.error("Error al obtener historiales:", error);
    return [];
  }
};

export const getHistorialId = async (id: number) => {
  try {
    const response = await api.get(`/historial/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
};

export const updateHistorial = async (id: number, data: Partial<Historial>) => {
  try {
    const response = await api.put(`/historial/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar historial:", error);
    return null;
  }
};

export const deleteHistorial = async (id: number) => {
  try {
    const response = await api.delete(`/historial/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al borrar historial:", error);
    return [];
  }
};

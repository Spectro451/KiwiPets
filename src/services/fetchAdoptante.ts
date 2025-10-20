import { Adoptante } from "../types/adoptante";
import { api } from "./api";

export const getAdoptante = async () => {
  try {
    const response = await api.get("/adoptante")
    return response.data;
  } catch (error) {
    console.error("Error al obtener adoptantees:", error);
    return [];
  }
};

export const getAdoptanteId = async (rut:string) => {
  try {
    const response = await api.get(`/adoptante/${rut}`)
    return response.data;
  } catch (error) {
    console.error("Error al obtener adoptante:", error);
    return null;
  }
};

export const updateAdoptante = async (rut: string, data: Partial<Adoptante>) => {
  try {
    const response = await api.put(`/adoptante/${rut}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar adoptante:", error);
    throw error;
  }
};

export const deleteAdoptante = async (rut:string) => {
  try {
    const response = await api.delete(`/adoptante/${rut}`)
    return response.data;
  } catch (error) {
    console.error("Error al borrar adoptante:", error);
    return [];
  }
};

export const adoptanteByUsuarioId = async () => {
  try {
    const response = await api.get("/adoptante/yo");
    return response.data;
  } catch (error) {
    console.error("No se encontro el adoptante:", error);
    return null;
  }
};
import { Refugio } from "../types/refugio";
import { api } from "./api";

export const getRefugio = async () => {
  try {
    const response = await api.get("/refugio")
    return response.data;
  } catch (error) {
    console.error("Error al obtener refugioes:", error);
    return [];
  }
};

export const getRefugioId = async (id: number) => {
  try {
    const response = await api.get(`/refugio/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error al obtener refugio:", error);
    return [];
  }
};

export const updateRefugio = async (id: number, data: Partial<Refugio>) => {
  try {
    const response = await api.put(`/refugio/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar refugio:", error);
    return null;
  }
};

export const deleteRefugio = async (id: number) => {
  try {
    const response = await api.delete(`/refugio/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error al borrar refugio:", error);
    return [];
  }
};

export const refugioByUsuarioId = async () => {
  try {
    const response = await api.get("/refugio/yo");
    return response.data;
  } catch (error) {
    console.error("No se encontro el refugio:", error);
    return null;
  }
};
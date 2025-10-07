import { api } from "./api";
import { Mascota } from "../types/mascota";

export const getMascotas = async () => {
  try {
    const response = await api.get("/mascota");
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return [];
  }
};

export const getMascotasId = async (id: number) => {
  try {
    const response = await api.get(`/mascota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascota:", error);
    return null;
  }
};

export const updateMascotas = async (id: number, data: Partial<Mascota>) => {
  try {
    const response = await api.put(`/mascota/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar mascota:", error);
    return null;
  }
};

export const deleteMascotas = async (id: number) => {
  try {
    const response = await api.delete(`/mascota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al borrar mascota:", error);
    return [];
  }
};

export const createMascota = async (data: Partial<Mascota>) => {
  try {
    const response = await api.post("/mascota", data);
    return response.data;
  } catch (error: any) {
    console.error("Error al crear mascota:", error.response?.data || error.message);
    throw error;
  }
};

export const transferirMascotas = async (mascotasIds: number[], refugioDestinoId: number) => {
  try {
    const response = await api.post("/mascota/transferir", {
      mascotasIds,
      refugioDestinoId,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al transferir mascotas:", error.response?.data || error.message);
    throw error;
  }
};


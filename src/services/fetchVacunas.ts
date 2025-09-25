import { api } from "./api";
import { Vacunas } from "../types/vacunas";

export const getVacunas = async () => {
  try {
    const response = await api.get("/vacunas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener vacunas:", error);
    return [];
  }
};

export const getVacunasId = async (id: number) => {
  try {
    const response = await api.get(`/vacunas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vacuna:", error);
    return null;
  }
};

export const updateVacunas = async (id: number, data: Partial<Vacunas>) => {
  try {
    const response = await api.put(`/vacunas/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar vacuna:", error);
    return null;
  }
};

export const deleteVacunas = async (id: number) => {
  try {
    const response = await api.delete(`/vacunas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al borrar vacuna:", error);
    return null;
  }
};

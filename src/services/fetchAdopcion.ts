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

export const updateAdopcion = async (id: number, body:{data: Partial<Adopcion>; motivo?:string}) => {
  try {
    const response = await api.put(`/adopcion/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Error al modificar adopcion:", error);
    return null;
  }
};

export const deleteAdopcion = async (id:number) => {
  try {
    console.log("==== ENVIANDO DELETE ====", id);
    const response = await api.delete(`/adopcion/${id}`);
    console.log("Respuesta backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al borrar adopcion:", error);
    return [];
  }
};

export const createAdopcion = async (mascotaId: number) => {
  try {
    const response = await api.post("/adopcion", { mascota: { id_mascota: mascotaId } });
    return response.data;
  } catch (error) {
    console.error("Error al crear adopción:", error);
    return null;
  }
};
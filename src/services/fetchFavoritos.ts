import { api } from "./api";
import { Favoritos } from "../types/favoritos";

export const getFavorito = async () => {
  try {
    const response = await api.get("/favoritos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return [];
  }
};

export const getFavoritoId = async (id: number) => {
  try {
    const response = await api.get(`/favoritos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return [];
  }
};

export const updateFavorito = async (id: number, data: Partial<Favoritos>) => {
  try {
    const response = await api.put(`/favoritos/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar favoritos:", error);
    return null;
  }
};

export const deleteFavorito = async (id: number) => {
  try {
    const response = await api.delete(`/favoritos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al borrar favoritos:", error);
    return [];
  }
};

export const createFavorito = async (mascotaId: number) => {
  const payload = { mascota: { id_mascota: mascotaId } };
  console.log("Payload que se enviará al backend (favorito):", payload);

  try {
    const response = await api.post("/favoritos", payload);
    return response.data;
  } catch (error) {
    console.error("Error al crear favorito:", error);
    return null;
  }
};
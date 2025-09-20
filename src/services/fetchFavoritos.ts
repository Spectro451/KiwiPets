import { api } from "./api";

export const getFavorito = async () => {
  try {
    const response = await api.get("/favoritos")
    return response.data;
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return [];
  }
};

export const getFavoritoId = async () => {
  try {
    const response = await api.get("/favoritos/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return [];
  }
};

export const updateFavorito = async () => {
  try {
    const response = await api.put("/favoritos")
    return response.data;
  } catch (error) {
    console.error("Error al modificar favoritos:", error);
    return [];
  }
};

export const deleteFavorito = async () => {
  try {
    const response = await api.delete("/favoritos/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar favoritos:", error);
    return [];
  }
};
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

export const getAdoptanteId = async () => {
  try {
    const response = await api.get("/adoptante/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener adoptante:", error);
    return [];
  }
};

export const updateAdoptante = async () => {
  try {
    const response = await api.put("/adoptante")
    return response.data;
  } catch (error) {
    console.error("Error al modificar adoptante:", error);
    return [];
  }
};

export const deleteAdoptante = async () => {
  try {
    const response = await api.delete("/adoptante/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar adoptante:", error);
    return [];
  }
};
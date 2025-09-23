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

export const updateAdoptante = async (id: number, data: { nombre: string; direccion: string; telefono: string }) => {
  try {
    const response = await api.put(`/adoptante/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar adoptante:", error);
    return null;
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

export const adoptanteByUsuarioId = async () => {
  try {
    const response = await api.get("/adoptante/yo");
    return response.data;
  } catch (error) {
    console.error("No se encontro el adoptante:", error);
    return null;
  }
};
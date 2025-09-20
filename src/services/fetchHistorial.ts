import { api } from "./api";

export const getHistorial = async () => {
  try {
    const response = await api.get("/historial")
    return response.data;
  } catch (error) {
    console.error("Error al obtener historiales:", error);
    return [];
  }
};

export const getHistorialId = async () => {
  try {
    const response = await api.get("/historial/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
};

export const updateHistorial = async () => {
  try {
    const response = await api.put("/historial")
    return response.data;
  } catch (error) {
    console.error("Error al modificar historial:", error);
    return [];
  }
};

export const deleteHistorial = async () => {
  try {
    const response = await api.delete("/historial/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar historial:", error);
    return [];
  }
};
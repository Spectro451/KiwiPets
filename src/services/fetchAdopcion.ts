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

export const getAdopcionId = async () => {
  try {
    const response = await api.get("/adopcion/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener adopcion:", error);
    return [];
  }
};

export const updateAdopcion = async () => {
  try {
    const response = await api.put("/adopcion")
    return response.data;
  } catch (error) {
    console.error("Error al modificar adopcion:", error);
    return [];
  }
};

export const deleteAdopcion = async () => {
  try {
    const response = await api.delete("/adopcion/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar adopcion:", error);
    return [];
  }
};
import { api } from "./api";

export const getUsuario = async () => {
  try {
    const response = await api.get("/usuario")
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarioes:", error);
    return [];
  }
};

export const getUsuarioId = async () => {
  try {
    const response = await api.get("/usuario/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return [];
  }
};

export const updateUsuario = async () => {
  try {
    const response = await api.put("/usuario")
    return response.data;
  } catch (error) {
    console.error("Error al modificar usuario:", error);
    return [];
  }
};

export const deleteUsuario = async () => {
  try {
    const response = await api.delete("/usuario/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar usuario:", error);
    return [];
  }
};
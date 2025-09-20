import { api } from "./api";

export const getRefugio = async () => {
  try {
    const response = await api.get("/refugio")
    return response.data;
  } catch (error) {
    console.error("Error al obtener refugioes:", error);
    return [];
  }
};

export const getRefugioId = async () => {
  try {
    const response = await api.get("/refugio/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener refugio:", error);
    return [];
  }
};

export const updateRefugio = async () => {
  try {
    const response = await api.put("/refugio")
    return response.data;
  } catch (error) {
    console.error("Error al modificar refugio:", error);
    return [];
  }
};

export const deleteRefugio = async () => {
  try {
    const response = await api.delete("/refugio/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar refugio:", error);
    return [];
  }
};
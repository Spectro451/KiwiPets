import { api } from "./api";

export const getVacunas = async () => {
  try {
    const response = await api.get("/vacunas")
    return response.data;
  } catch (error) {
    console.error("Error al obtener vacunases:", error);
    return [];
  }
};

export const getVacunasId = async () => {
  try {
    const response = await api.get("/vacunas/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener vacunas:", error);
    return [];
  }
};

export const updateVacunas = async () => {
  try {
    const response = await api.put("/vacunas")
    return response.data;
  } catch (error) {
    console.error("Error al modificar vacunas:", error);
    return [];
  }
};

export const deleteVacunas = async () => {
  try {
    const response = await api.delete("/vacunas/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar vacunas:", error);
    return [];
  }
};
import { api } from "./api";

export const getMascotas = async () => {
  try {
    const response = await api.get("/mascota")
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return [];
  }
};

export const getMascotasId = async () => {
  try {
    const response = await api.get("/mascota/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return [];
  }
};

export const updateMascotas = async () => {
  try {
    const response = await api.put("/mascota")
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return [];
  }
};

export const deleteMascotas = async () => {
  try {
    const response = await api.delete("/mascota/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return [];
  }
};
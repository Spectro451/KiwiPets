import axios from "axios";

const API_URL = "http://192.168.1.7:3000"; // Ej: http://192.168.1.10:3000

export const getMascotas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mascota`); // Tu endpoint GET /mascotas
    return response.data; // Devuelve el array de mascotas
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return [];
  }
};

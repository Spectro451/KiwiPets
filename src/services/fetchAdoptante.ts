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

export const getAdoptanteId = async (rut:string) => {
  try {
    const response = await api.get(`/adoptante/${rut}`)
    return response.data;
  } catch (error) {
    console.error("Error al obtener adoptante:", error);
    return null;
  }
};

export const updateAdoptante = async (rut: string, data: {
  nombre: string;
  edad: number;
  telefono: string;
  direccion: string;
  cantidad_mascotas: number;
  especie_preferida: 'Gato' | 'Perro' | 'Ave' | 'Reptil' | 'Cualquiera';
  tipo_vivienda: 'Casa con patio' | 'Casa sin patio' | 'Departamento con patio' | 'Departamento sin patio';
  sexo: 'Masculino' | 'Femenino' | 'Cualquiera';
  edad_buscada: 'Cachorro' | 'Joven' | 'Adulto';
  motivo_adopcion: string;
}) => {
  try {
    const response = await api.put(`/adoptante/${rut}`, data);
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
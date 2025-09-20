import { api } from "./api";

export const getNotificaciones = async () => {
  try {
    const response = await api.get("/notificaciones")
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificacioneses:", error);
    return [];
  }
};

export const getNotificacionesId = async () => {
  try {
    const response = await api.get("/notificaciones/${id}")
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

export const updateNotificaciones = async () => {
  try {
    const response = await api.put("/notificaciones")
    return response.data;
  } catch (error) {
    console.error("Error al modificar notificaciones:", error);
    return [];
  }
};

export const deleteNotificaciones = async () => {
  try {
    const response = await api.delete("/notificaciones/{id}")
    return response.data;
  } catch (error) {
    console.error("Error al borrar notificaciones:", error);
    return [];
  }
};
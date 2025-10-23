import { Notificaciones } from "../types/notificaciones";
import { api } from "./api";

export const getNotificaciones = async () => {
  try {
    const response = await api.get("/notificaciones");
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

export const getNotificacionesId = async (id:number) => {
  try {
    const response = await api.get(`/notificaciones/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

export const updateNotificaciones = async (id: number, data: Partial<Notificaciones>) => {
  try {
    const response = await api.put(`/notificaciones/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al modificar notificaciones:", error);
    return null;
  }
};

export const deleteNotificaciones = async (id:number) => {
  try {
    const response = await api.delete(`/notificaciones/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error al borrar notificaciones:", error);
    return [];
  }
};

export const marcarLeida = async (id: number) => {
  try {
    const response = await api.put(`/notificaciones/${id}/leida`);
    return response.data;
  } catch (error) {
    console.error("Error al marcar como leída:", error);
    return null;
  }
};
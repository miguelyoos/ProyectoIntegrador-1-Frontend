import api from "./axiosClient";

export const obtenerSubtareas = async (actividadId) => {
  const response = await api.get(`/subtareas?actividadId=${actividadId}`);
  return response.data;
};

export const crearSubtarea = async (subtarea) => {
  const response = await api.post("/subtareas", subtarea);
  return response.data;
};
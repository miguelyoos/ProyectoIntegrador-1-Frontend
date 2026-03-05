import api from "./axiosClient";

export const obtenerSubtareas = async (actividadId) => {
  const response = await api.get(`/subtareas/?actividadId=${actividadId}`);
  return response.data;
};

export const crearSubtarea = async (subtarea) => {
  const response = await api.post("/subtareas/", subtarea);
  return response.data;
};
export const editarSubtarea = async (id, data) => {
  const response = await api.patch(`/subtareas/${id}/`, data);
  return response.data;
};

// eliminar subtarea
export const eliminarSubtarea = async (id) => {
  await api.delete(`/subtareas/${id}/`);
};
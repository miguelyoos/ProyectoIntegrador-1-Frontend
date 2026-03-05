import api from "./axiosClient";

export const obtenerActividades = async () => {
  const response = await api.get("/actividades/");
  console.log("🔍 Actividad del backend:", response.data);
  return response.data;
};
export const crearActividad = async (actividad) => {
  console.log("📤 Enviando al backend:", actividad);
  const response = await api.post("/actividades/", actividad);
  console.log("📥 Respuesta del backend:", response.data);
  return response.data;
};

export const actualizarActividad = async (id, cambios) => {
  const response = await api.put(`/actividades/${id}/`, cambios);
  return response.data;
};

export const eliminarActividad = async (id) => {
  await api.delete(`/actividades/${id}/`);
};

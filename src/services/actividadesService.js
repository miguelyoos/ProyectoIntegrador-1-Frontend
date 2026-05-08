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
  // Preparar datos para el backend - remover campos calculados
  const datosParaBackend = {
    titulo: cambios.titulo,
    tipo: cambios.tipo,
    materia: cambios.materia,
    desc: cambios.desc || '',
    fecha: cambios.fecha,
    prioridad: cambios.prioridad,
    horasEst: cambios.horasEst,
    horasComp: cambios.horasComp,
  };
  
  try {
    console.log("📤 Actualizando actividad:", id, datosParaBackend);
    const response = await api.patch(`/actividades/${id}/`, datosParaBackend);
    console.log("📥 Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ Error backend:", error.response?.data);
    throw error;
  }
};

export const eliminarActividad = async (id) => {
  await api.delete(`/actividades/${id}/`);
};

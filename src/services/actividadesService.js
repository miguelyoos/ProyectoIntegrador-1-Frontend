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
  // Preparar datos para el backend - remover campos calculados y asegurar tipos correctos
  const datosParaBackend = {
    titulo: cambios.titulo,
    tipo: cambios.tipo,
    materia: cambios.materia,
    desc: cambios.desc || '',
    fecha: cambios.fecha,
    prioridad: cambios.prioridad,
    horasEst: Number(cambios.horasEst) || 0,
    horasComp: Number(cambios.horasComp) || 0,
  };
  
  // Asegurar que no se envíen campos no válidos
  Object.keys(datosParaBackend).forEach(key => {
    if (datosParaBackend[key] === undefined || datosParaBackend[key] === null) {
      delete datosParaBackend[key];
    }
    // Verificar que horasEst y horasComp sean números
    if ((key === 'horasEst' || key === 'horasComp') && typeof datosParaBackend[key] !== 'number') {
      console.error(`❌ ${key} no es un número:`, datosParaBackend[key]);
      datosParaBackend[key] = 0;
    }
  });
  
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

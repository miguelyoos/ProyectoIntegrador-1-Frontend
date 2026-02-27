// Simulación de API con localStorage
const STORAGE_KEY = 'actividades';
const API_URL = import.meta.env.VITE_API_URL;

export async function testConnection() {
  const response = await fetch(`${API_URL}/api/test/`);
  return response.json();
}

const getActividades = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveActividades = (actividades) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actividades));
};

export const obtenerActividadesHoy = async () => {
  const hoy = new Date().toISOString().split('T')[0];
  const actividades = getActividades();
  return actividades.filter(a => a.fecha === hoy);
};

export const obtenerActividad = async (id) => {
  const actividades = getActividades();
  return actividades.find(a => a.id === id);
};

export const crearActividad = async (actividad) => {
  const actividades = getActividades();
  const nueva = {
    ...actividad,
    id: Date.now().toString(),
    completada: false,
    createdAt: new Date().toISOString(),
  };
  actividades.push(nueva);
  saveActividades(actividades);
  return nueva;
};

export const actualizarActividad = async (id, cambios) => {
  const actividades = getActividades();
  const index = actividades.findIndex(a => a.id === id);
  if (index !== -1) {
    actividades[index] = { ...actividades[index], ...cambios };
    saveActividades(actividades);
  }
  return actividades[index];
};

export const eliminarActividad = async (id) => {
  const actividades = getActividades();
  const filtradas = actividades.filter(a => a.id !== id);
  saveActividades(filtradas);
};

export const obtenerEstadisticas = async () => {
  const actividades = getActividades();
  return {
    total: actividades.length,
    completadas: actividades.filter(a => a.completada).length,
    pendientes: actividades.filter(a => !a.completada).length,
  };
};

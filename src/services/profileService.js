import api from "./axiosClient";

// Obtener perfil del usuario autenticado
export const obtenerPerfil = async () => {
  const response = await api.get("/profile/");
  return response.data;
};

// Actualizar límite diario de horas
export const actualizarLimite = async (limite) => {
  const response = await api.patch("/profile/", { limite_diario_horas: limite });
  return response.data;
};

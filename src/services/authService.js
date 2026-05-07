import api from "./axiosClient";

export const login = async (credentials) => {
  try {
    const response = await api.post("/login/", credentials);

    const { access, refresh } = response.data;

    localStorage.setItem("token", access);
    if (refresh) {
      localStorage.setItem("refresh", refresh);
    }

    return response.data;
  } catch (error) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error;
  }
};
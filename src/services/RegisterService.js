import api from "./axiosClient";

export const register = async (userData) => {
  const response = await api.post("/register/", userData);
  return response.data;
};

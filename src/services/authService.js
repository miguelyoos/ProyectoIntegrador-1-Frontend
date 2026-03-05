import api from "./axiosClient";

export const login = async (credentials) => {
  const response = await api.post("/login/", credentials);

  const accessToken = response.data.access;

  localStorage.setItem("token", accessToken);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
};
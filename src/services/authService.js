import api from "./api";

export async function login(email, password) {
  const response = await api.post("/users/login", { email, password });
  return response.data;
}

export async function register({ name, email, password }) {
  const response = await api.post("/users/register", { name, email, password, role: "PATIENT" });
  return response.data;
}

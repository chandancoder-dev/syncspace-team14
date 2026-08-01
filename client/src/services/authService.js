import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export async function registerUser({ fullName, username, email, password }) {
  const response = await axios.post(`${SERVER_URL}/api/auth/register`, {
    name: fullName || username,
    username,
    email,
    password,
  });
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await axios.post(`${SERVER_URL}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
}

export async function getCurrentUser(token) {
  const response = await axios.get(`${SERVER_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

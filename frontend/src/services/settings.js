import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Get settings
export const getSettings = async () => {
  const res = await API.get("/settings", authHeader());
  return res.data;
};

// Update settings
export const updateSettings = async (data) => {
  const res = await API.put("/settings", data, authHeader());
  return res.data;
};
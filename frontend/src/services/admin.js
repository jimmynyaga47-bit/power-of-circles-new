import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Get all admins
export const getAdmins = async () => {
  const res = await API.get(
    "/admins/users",
    authHeader()
  );

  return res.data;
};

// Approve admin
export const approveAdmin = async (id) => {
  const res = await API.put(
    `/admins/approve/${id}`,
    {},
    authHeader()
  );

  return res.data;
};

// Activate / Deactivate admin
export const toggleAdminStatus = async (id) => {
  const res = await API.put(
    `/admins/toggle/${id}`,
    {},
    authHeader()
  );

  return res.data;
};
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAdminRequests = async () => {
  const res = await API.get(
    "/admin-requests",
    authHeader()
  );

  return res.data;
};
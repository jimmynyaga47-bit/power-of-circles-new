import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getEventReport = async () => {
  const res = await API.get("/reports/events", authHeader());
  return res.data.events;
};

export const getCategoryReport = async () => {
  const res = await API.get("/reports/categories", authHeader());
  return res.data.categories;
};

export const getCheckinReport = async () => {
  const res = await API.get("/reports/checkins", authHeader());
  return res.data.events;
};

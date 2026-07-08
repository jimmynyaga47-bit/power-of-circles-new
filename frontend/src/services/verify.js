import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const verifyTicket = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.post(
    "/verify",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
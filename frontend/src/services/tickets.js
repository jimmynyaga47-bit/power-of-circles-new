import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getTicketTypes = async (eventId) => {
  const response = await API.get(`/tickets/event/${eventId}`);
  return response.data.ticketTypes;
};

// Create a ticket type
export const createTicketType = async (eventId, ticketData) => {
  const token = localStorage.getItem("token");

  const response = await API.post(
    `/tickets/event/${eventId}`,
    ticketData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update a ticket type
export const updateTicketType = async (id, ticketData) => {
  const token = localStorage.getItem("token");

  const response = await API.put(
    `/tickets/${id}`,
    ticketData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete a ticket type
export const deleteTicketType = async (id) => {
  const token = localStorage.getItem("token");

  const response = await API.delete(`/tickets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
// Purchase Ticket
export const purchaseTicket = async (ticketData) => {
  const response = await API.post("/tickets/purchase", ticketData);
  return response.data;
};
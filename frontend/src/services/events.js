import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Get all events
export const getEvents = async () => {
  const response = await API.get("/events");
  return response.data.events;
};

// Get one event
export const getEvent = async (id) => {
  const response = await API.get(`/events/${id}`);
  return response.data.event;
};

// Create event
export const createEvent = async (eventData) => {
  const token = localStorage.getItem("token");

  const response = await API.post("/events", eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

// Update event
export const updateEvent = async (id, eventData) => {
  const token = localStorage.getItem("token");

  const response = await API.put(`/events/${id}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
  const token = localStorage.getItem("token");

  const response = await API.delete(`/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Get all purchased tickets (supports search, filters & pagination)
export const getPurchasedTickets = async (params = {}) => {
  const res = await API.get("/tickets", {
    params,
    ...authHeader(),
  });

  return res.data.tickets;
};

// Get all purchased tickets with full pagination metadata
export const getPurchasedTicketsPaged = async (params = {}) => {
  const res = await API.get("/tickets", {
    params,
    ...authHeader(),
  });

  return res.data;
};

// Create a manual ticket (supports categories: paid, complimentary, vip, staff, media, speaker)
export const createManualTicket = async (data) => {
  const res = await API.post("/tickets/manual", data, authHeader());
  return res.data;
};

// Bulk upload tickets via CSV/Excel file
export const bulkUploadTickets = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/tickets/bulk-upload", formData, {
    headers: {
      ...authHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Upgrade / downgrade a ticket's type
export const upgradeTicket = async (id, ticket_type_id) => {
  const res = await API.put(
    `/tickets/${id}/upgrade`,
    { ticket_type_id },
    authHeader()
  );
  return res.data;
};

// Regenerate & re-email a ticket's QR code
export const regenerateQrCode = async (id) => {
  const res = await API.post(`/tickets/${id}/qr-regenerate`, {}, authHeader());
  return res.data;
};

// Download a ticket as a PDF
export const downloadTicketPdf = async (id, ticketNumber) => {
  const res = await API.get(`/tickets/${id}/pdf`, {
    ...authHeader(),
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `ticket-${ticketNumber || id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Get one ticket
export const getTicket = async (id) => {
  const token = localStorage.getItem("token");

  const res = await API.get(`/tickets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.ticket;
};

// Cancel ticket
export const cancelTicket = async (id) => {
  const token = localStorage.getItem("token");

  const res = await API.put(
    `/tickets/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Resend ticket
export const resendTicket = async (id) => {
  const token = localStorage.getItem("token");

  const res = await API.post(
    `/tickets/${id}/resend`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
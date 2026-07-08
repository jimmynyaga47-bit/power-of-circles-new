import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
  getPurchasedTicketsPaged,
  getTicket,
  cancelTicket,
  resendTicket,
  createManualTicket,
  bulkUploadTickets,
  upgradeTicket,
  regenerateQrCode,
  downloadTicketPdf,
} from "../../services/purchasedTickets";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "paid", label: "Paid" },
  { value: "complimentary", label: "Complimentary" },
  { value: "vip", label: "VIP Invitation" },
  { value: "staff", label: "Staff" },
  { value: "media", label: "Media" },
  { value: "speaker", label: "Speaker" },
];

const MANUAL_CATEGORIES = CATEGORIES.filter((c) => c.value !== "");

function TicketCenter() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showManualModal, setShowManualModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradingTicket, setUpgradingTicket] = useState(null);
  const [selectedUpgradeType, setSelectedUpgradeType] = useState("");
  const [viewingTicket, setViewingTicket] = useState(null);

  const [events, setEvents] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [bulkFile, setBulkFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const [manualTicket, setManualTicket] = useState({
    customer_name: "",
    email: "",
    phone: "",
    event_id: "",
    ticket_type_id: "",
    category: "paid",
  });

  const loadTickets = useCallback(async () => {
    try {
      const data = await getPurchasedTicketsPaged({
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit: 10,
      });
      setTickets(data.tickets || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    }
  }, [search, categoryFilter, statusFilter, page]);

  const loadEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTicketTypes = async (eventId) => {
    if (!eventId) {
      setTicketTypes([]);
      return;
    }
    try {
      const res = await axios.get(`${API}/events/${eventId}/ticket-types`);
      setTicketTypes(res.data.ticketTypes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this ticket?")) return;
    try {
      await cancelTicket(id);
      loadTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel ticket.");
    }
  };

  const handleResend = async (id) => {
    try {
      await resendTicket(id);
      alert("Ticket emailed successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to resend ticket.");
    }
  };

  const handleView = async (id) => {
    try {
      const ticket = await getTicket(id);
      setViewingTicket(ticket);
    } catch (err) {
      console.error(err);
      alert("Unable to load ticket.");
    }
  };

  const handleDownloadPdf = async (ticket) => {
    try {
      await downloadTicketPdf(ticket.id, ticket.ticket_number);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF.");
    }
  };

  const handleRegenerateQr = async (id) => {
    if (!window.confirm("Generate a new QR code and email it to the customer?")) return;
    try {
      await regenerateQrCode(id);
      alert("New QR code generated and emailed.");
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate QR code.");
    }
  };

  const openUpgradeModal = async (ticket) => {
    setUpgradingTicket(ticket);
    setSelectedUpgradeType("");
    setShowUpgradeModal(true);
    try {
      const res = await axios.get(`${API}/events/${ticket.event_id}/ticket-types`);
      setTicketTypes(res.data.ticketTypes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedUpgradeType) {
      alert("Please select a ticket type.");
      return;
    }
    try {
      setBusy(true);
      await upgradeTicket(upgradingTicket.id, selectedUpgradeType);
      alert("Ticket updated successfully.");
      setShowUpgradeModal(false);
      loadTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to update ticket.");
    } finally {
      setBusy(false);
    }
  };

  const createManual = async () => {
    if (
      !manualTicket.customer_name ||
      !manualTicket.email ||
      !manualTicket.event_id ||
      !manualTicket.ticket_type_id
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setBusy(true);
      await createManualTicket(manualTicket);
      alert("Ticket created successfully.");
      setShowManualModal(false);
      setManualTicket({
        customer_name: "",
        email: "",
        phone: "",
        event_id: "",
        ticket_type_id: "",
        category: "paid",
      });
      loadTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to create ticket.");
    } finally {
      setBusy(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      alert("Please choose a CSV or Excel file first.");
      return;
    }
    try {
      setBusy(true);
      const res = await bulkUploadTickets(bulkFile);
      alert(res.message || "Bulk upload complete.");
      setBulkFile(null);
      loadTickets();
    } catch (err) {
      console.error(err);
      alert("Bulk upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const categoryLabel = (value) =>
    CATEGORIES.find((c) => c.value === value)?.label || "Paid";

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Ticket Centre</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg"
          >
            + Manual Ticket
          </button>
        </div>
      </div>

      {/* Bulk upload */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-wrap items-center gap-4">
        <div>
          <h3 className="font-semibold">Bulk Ticket Upload</h3>
          <p className="text-sm text-gray-500">
            Upload a CSV or Excel file with columns: event_id, ticket_type_id, customer_name, email, phone, category
          </p>
        </div>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setBulkFile(e.target.files[0])}
          className="text-sm"
        />
        <button
          onClick={handleBulkUpload}
          disabled={busy}
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Upload
        </button>
      </div>

      {/* Search & filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          className="border rounded-lg p-3"
          placeholder="Search customer, email, ticket number or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg p-3"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg p-3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="issued">Issued</option>
          <option value="checked_in">Checked In</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Ticket</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t align-top">
                  <td className="p-4">{ticket.ticket_number}</td>

                  <td className="p-4">
                    <strong>{ticket.customer_name}</strong>
                    <br />
                    <span className="text-sm text-gray-500">{ticket.email}</span>
                  </td>

                  <td className="p-4">{ticket.event_name}</td>

                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {categoryLabel(ticket.category)}
                    </span>
                  </td>

                  <td className="p-4">KSh {ticket.price}</td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ticket.status === "paid" || ticket.status === "issued"
                          ? "bg-green-100 text-green-700"
                          : ticket.status === "checked_in"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleView(ticket.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(ticket)}
                        className="bg-slate-700 text-white px-3 py-1 rounded text-sm"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleRegenerateQr(ticket.id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                      >
                        New QR
                      </button>
                      <button
                        onClick={() => openUpgradeModal(ticket)}
                        className="bg-amber-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Upgrade
                      </button>
                      <button
                        onClick={() => handleResend(ticket.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Resend
                      </button>
                      <button
                        onClick={() => handleCancel(ticket.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          {total} ticket{total === 1 ? "" : "s"} total
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 rounded-lg border disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 rounded-lg border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Manual Ticket Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create Manual Ticket</h2>

            <div className="space-y-3">
              <input
                className="w-full border rounded-lg p-3"
                placeholder="Customer Name"
                value={manualTicket.customer_name}
                onChange={(e) =>
                  setManualTicket({ ...manualTicket, customer_name: e.target.value })
                }
              />
              <input
                className="w-full border rounded-lg p-3"
                placeholder="Email"
                type="email"
                value={manualTicket.email}
                onChange={(e) => setManualTicket({ ...manualTicket, email: e.target.value })}
              />
              <input
                className="w-full border rounded-lg p-3"
                placeholder="Phone"
                value={manualTicket.phone}
                onChange={(e) => setManualTicket({ ...manualTicket, phone: e.target.value })}
              />

              <select
                className="w-full border rounded-lg p-3"
                value={manualTicket.event_id}
                onChange={(e) => {
                  const eventId = e.target.value;
                  setManualTicket({ ...manualTicket, event_id: eventId, ticket_type_id: "" });
                  loadTicketTypes(eventId);
                }}
              >
                <option value="">Select Event</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full border rounded-lg p-3"
                value={manualTicket.ticket_type_id}
                onChange={(e) =>
                  setManualTicket({ ...manualTicket, ticket_type_id: e.target.value })
                }
                disabled={!manualTicket.event_id}
              >
                <option value="">Select Ticket Type</option>
                {ticketTypes.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.name} — KSh {tt.price}
                  </option>
                ))}
              </select>

              <select
                className="w-full border rounded-lg p-3"
                value={manualTicket.category}
                onChange={(e) => setManualTicket({ ...manualTicket, category: e.target.value })}
              >
                {MANUAL_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={createManual}
                disabled={busy}
                className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && upgradingTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-2">Upgrade / Downgrade Ticket</h2>
            <p className="text-sm text-gray-500 mb-4">
              {upgradingTicket.ticket_number} — {upgradingTicket.customer_name}
            </p>

            <select
              className="w-full border rounded-lg p-3"
              value={selectedUpgradeType}
              onChange={(e) => setSelectedUpgradeType(e.target.value)}
            >
              <option value="">Select New Ticket Type</option>
              {ticketTypes.map((tt) => (
                <option key={tt.id} value={tt.id}>
                  {tt.name} — KSh {tt.price}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade}
                disabled={busy}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Ticket Number:</strong> {viewingTicket.ticket_number}</p>
              <p><strong>Customer:</strong> {viewingTicket.customer_name}</p>
              <p><strong>Email:</strong> {viewingTicket.email}</p>
              <p><strong>Phone:</strong> {viewingTicket.phone || "—"}</p>
              <p><strong>Event:</strong> {viewingTicket.event_name}</p>
              <p><strong>Ticket Type:</strong> {viewingTicket.ticket_type}</p>
              <p><strong>Category:</strong> {categoryLabel(viewingTicket.category)}</p>
              <p><strong>Price:</strong> KSh {viewingTicket.price}</p>
              <p><strong>Status:</strong> {viewingTicket.status}</p>
            </div>
            {viewingTicket.qr_code && (
              <img
                src={viewingTicket.qr_code}
                alt="Ticket QR"
                className="w-32 h-32 mx-auto mt-4"
              />
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingTicket(null)}
                className="px-5 py-2 rounded-lg border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketCenter;

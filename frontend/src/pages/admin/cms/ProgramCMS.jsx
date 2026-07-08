import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ProgramCMS() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [programs, setPrograms] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({ title: "", pdf_url: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API}/events`)
      .then((res) => setEvents(res.data.events || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    loadPrograms();
    loadSubscriptions();
  }, [selectedEvent]);

  const loadPrograms = async () => {
    try {
      const res = await axios.get(`${API}/cms/programs?event_id=${selectedEvent}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(res.data);
    } catch (err) { console.error(err); }
  };

  const loadSubscriptions = async () => {
    try {
      const res = await axios.get(
        `${API}/cms/subscriptions?event_id=${selectedEvent}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscriptions(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedEvent) { alert("Please select an event first"); return; }
    setLoading(true);
    try {
      await axios.post(
        `${API}/cms/programs`,
        { event_id: selectedEvent, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Program uploaded successfully!");
      setForm({ title: "", pdf_url: "" });
      loadPrograms();
    } catch {
      alert("Failed to upload program");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;
    try {
      await axios.delete(`${API}/cms/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadPrograms();
    } catch { alert("Failed to delete"); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Program Manager</h1>
        <p className="text-gray-500 mt-1">
          Upload event programs (PDF) and view email subscribers.
        </p>
      </div>

      {/* Select Event */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Event
        </label>
        <select value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Select an event --</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {/* Upload Program */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📄 Upload Program PDF</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Program Title
                </label>
                <input value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Summit 2026 Program"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  PDF URL
                </label>
                <input value={form.pdf_url}
                  onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                  placeholder="https://drive.google.com/file/..."
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Upload your PDF to Google Drive, Dropbox or Cloudinary and paste the link here.
                </p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
                {loading ? "Uploading..." : "📤 Upload Program"}
              </button>
            </form>

            {/* Existing Programs */}
            {programs.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-3">Uploaded Programs</h3>
                <div className="space-y-2">
                  {programs.map((p) => (
                    <div key={p.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{p.title}</p>
                        <a href={p.pdf_url} target="_blank" rel="noreferrer"
                          className="text-blue-600 text-xs hover:underline">
                          View PDF →
                        </a>
                      </div>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold">
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subscribers */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              📧 Email Subscribers ({subscriptions.length})
            </h2>
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">📭</p>
                <p>No subscribers yet for this event.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-500 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{s.name || "—"}</td>
                        <td className="py-3 px-4 text-gray-600">{s.email}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">
                          {new Date(s.subscribed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ProgramCMS;
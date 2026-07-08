import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function EventProgram() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    axios.get(`${API}/events`)
      .then((res) => setEvents(res.data.events || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) { alert("Please select an event"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/cms/subscribe`, {
        event_id: selectedEvent,
        email: form.email,
        name: form.name,
      });
      setProgram(res.data.program);
      setSuccess(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-700 text-white py-24 px-6 text-center">
        <p className="uppercase tracking-widest text-blue-300 text-sm font-semibold mb-3">
          Event Programme
        </p>
        <h1 className="text-5xl font-extrabold mb-4">Get the Event Program</h1>
        <p className="text-blue-200 text-xl max-w-xl mx-auto">
          Enter your email to receive the full day's program for your selected event.
        </p>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-lg mx-auto">
          {success ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You're all set!
              </h2>
              <p className="text-gray-500 mb-6">
                Thank you <strong>{form.name}</strong>! The event program has been noted for{" "}
                <strong>{form.email}</strong>.
              </p>
              {program ? (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="font-semibold text-blue-900 mb-2">📄 {program.title}</p>
                  <a href={program.pdf_url} target="_blank" rel="noreferrer"
                    className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold transition">
                    📥 Download Program PDF
                  </a>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-yellow-700 text-sm">
                  ℹ️ The program for this event has not been uploaded yet.
                  We will notify you when it's available.
                </div>
              )}
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({ name: "", email: "" });
                  setSelectedEvent("");
                  setProgram(null);
                }}
                className="text-blue-600 hover:underline text-sm font-semibold">
                Subscribe to another event →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                📋 Request Event Program
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Select your event and enter your details to get the program.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Select Event *
                  </label>
                  <select value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Choose an event --</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} {ev.date ? `— ${new Date(ev.date).toLocaleDateString()}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-60">
                  {loading ? "Submitting..." : "📩 Get Event Program"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default EventProgram;
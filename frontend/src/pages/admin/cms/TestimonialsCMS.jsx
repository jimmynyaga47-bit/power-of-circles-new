import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function TestimonialsCMS() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", role: "", quote: "", photo_url: "", display_order: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  const loadTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/cms/testimonials`);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTestimonials(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/cms/testimonials/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Testimonial updated!");
      } else {
        await axios.post(`${API}/cms/testimonials`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Testimonial added!");
      }
      setForm({ name: "", role: "", quote: "", photo_url: "", display_order: 0 });
      setEditingId(null);
      setShowForm(false);
      loadTestimonials();
    } catch {
      alert("Failed to save testimonial");
    }
  };

  const handleEdit = (t) => {
    setForm({
      name: t.name || "",
      role: t.role || "",
      quote: t.quote || "",
      photo_url: t.photo_url || "",
      display_order: t.display_order || 0,
    });
    setEditingId(t.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await axios.delete(`${API}/cms/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTestimonials();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials CMS</h1>
          <p className="text-gray-500 mt-1">Manage testimonials shown on the public homepage.</p>
        </div>
        <button
          onClick={() => {
            setForm({ name: "", role: "", quote: "", photo_url: "", display_order: 0 });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          {showForm ? "✕ Cancel" : "➕ Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? "✏️ Edit Testimonial" : "➕ Add Testimonial"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Jane Wanjiku"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role / Company</label>
                <input name="role" value={form.role} onChange={handleChange}
                  placeholder="e.g. CEO, Wanjiku Investments"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
              <input name="photo_url" value={form.photo_url} onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quote / Testimonial *</label>
              <textarea name="quote" value={form.quote} onChange={handleChange} required rows={4}
                placeholder="What they said about Power of Circles..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <button type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition">
              {editingId ? "💾 Update" : "➕ Add Testimonial"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-16 text-center text-gray-400">
          <p className="text-5xl mb-4">💬</p>
          <p className="font-semibold">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow p-6">
              <div className="text-blue-600 text-4xl font-serif mb-3">"</div>
              <p className="text-gray-600 italic mb-4 text-sm">{t.quote}</p>
              <div className="flex items-center gap-3 mb-4">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.name}
                    className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-sm">
                    {t.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-blue-600 text-xs">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(t)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg text-sm font-semibold transition">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(t.id, t.name)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm transition">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestimonialsCMS;
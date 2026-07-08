import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function FoundersCMS() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", title: "", bio: "", quote: "", photo_url: "", display_order: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  const loadFounders = async () => {
    try {
      const res = await axios.get(`${API}/cms/founders`);
      setFounders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFounders(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/cms/founders/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Founder updated!");
      } else {
        await axios.post(`${API}/cms/founders`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Founder added!");
      }
      setForm({ name: "", title: "", bio: "", quote: "", photo_url: "", display_order: 0 });
      setEditingId(null);
      setShowForm(false);
      loadFounders();
    } catch (err) {
      alert("Failed to save founder");
    }
  };

  const handleEdit = (founder) => {
    setForm({
      name: founder.name || "",
      title: founder.title || "",
      bio: founder.bio || "",
      quote: founder.quote || "",
      photo_url: founder.photo_url || "",
      display_order: founder.display_order || 0,
    });
    setEditingId(founder.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API}/cms/founders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadFounders();
    } catch {
      alert("Failed to delete founder");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Founders CMS</h1>
          <p className="text-gray-500 mt-1">
            Manage founder profiles shown on the public About page.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ name: "", title: "", bio: "", quote: "", photo_url: "", display_order: 0 });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          {showForm ? "✕ Cancel" : "➕ Add Founder"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? "✏️ Edit Founder" : "➕ Add New Founder"}
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title / Role *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. Co-Founder & CEO"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
              <input name="photo_url" value={form.photo_url} onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {form.photo_url && (
                <img src={form.photo_url} alt="Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                placeholder="Short biography..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Quote</label>
              <input name="quote" value={form.quote} onChange={handleChange}
                placeholder="e.g. Connections create opportunities..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
              <input type="number" name="display_order" value={form.display_order} onChange={handleChange}
                className="w-32 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition">
              {editingId ? "💾 Update Founder" : "➕ Add Founder"}
            </button>
          </form>
        </div>
      )}

      {/* Founders List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading founders...</div>
      ) : founders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-16 text-center text-gray-400">
          <p className="text-5xl mb-4">👤</p>
          <p className="font-semibold">No founders added yet.</p>
          <p className="text-sm mt-1">Click "Add Founder" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {founders.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                {f.photo_url ? (
                  <img src={f.photo_url} alt={f.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                    {f.name?.[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{f.name}</h3>
                  <p className="text-blue-600 text-sm font-semibold">{f.title}</p>
                </div>
              </div>
              {f.bio && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{f.bio}</p>}
              {f.quote && (
                <p className="text-gray-400 text-xs italic mb-4">"{f.quote}"</p>
              )}
              <div className="flex gap-2">
                <button onClick={() => handleEdit(f)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg text-sm font-semibold transition">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(f.id, f.name)}
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

export default FoundersCMS;
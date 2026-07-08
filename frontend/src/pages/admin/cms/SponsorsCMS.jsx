import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TIERS = ["Title Sponsor", "Gold", "Silver", "Bronze", "General"];

function SponsorsCMS() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", logo_url: "", website: "", tier: "General", display_order: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  const loadSponsors = async () => {
    try {
      const res = await axios.get(`${API}/cms/sponsors`);
      setSponsors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSponsors(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/cms/sponsors/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Sponsor updated!");
      } else {
        await axios.post(`${API}/cms/sponsors`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Sponsor added!");
      }
      setForm({ name: "", logo_url: "", website: "", tier: "General", display_order: 0 });
      setEditingId(null);
      setShowForm(false);
      loadSponsors();
    } catch {
      alert("Failed to save sponsor");
    }
  };

  const handleEdit = (sponsor) => {
    setForm({
      name: sponsor.name || "",
      logo_url: sponsor.logo_url || "",
      website: sponsor.website || "",
      tier: sponsor.tier || "General",
      display_order: sponsor.display_order || 0,
    });
    setEditingId(sponsor.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API}/cms/sponsors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadSponsors();
    } catch {
      alert("Failed to delete sponsor");
    }
  };

  const tierColor = (tier) => ({
    "Title Sponsor": "bg-purple-100 text-purple-700",
    "Gold": "bg-yellow-100 text-yellow-700",
    "Silver": "bg-gray-100 text-gray-700",
    "Bronze": "bg-orange-100 text-orange-700",
    "General": "bg-blue-100 text-blue-700",
  }[tier] || "bg-gray-100 text-gray-600");

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsors CMS</h1>
          <p className="text-gray-500 mt-1">
            Manage sponsor logos and info shown on the public website.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ name: "", logo_url: "", website: "", tier: "General", display_order: 0 });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          {showForm ? "✕ Cancel" : "➕ Add Sponsor"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? "✏️ Edit Sponsor" : "➕ Add New Sponsor"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sponsor Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Safaricom"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tier</label>
                <select name="tier" value={form.tier} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {TIERS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
              <input name="logo_url" value={form.logo_url} onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {form.logo_url && (
                <img src={form.logo_url} alt="Logo preview"
                  className="mt-2 h-12 object-contain border rounded-lg p-1" />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
              <input name="website" value={form.website} onChange={handleChange}
                placeholder="https://sponsor-website.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
              <input type="number" name="display_order" value={form.display_order} onChange={handleChange}
                className="w-32 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition">
              {editingId ? "💾 Update Sponsor" : "➕ Add Sponsor"}
            </button>
          </form>
        </div>
      )}

      {/* Sponsors List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading sponsors...</div>
      ) : sponsors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-16 text-center text-gray-400">
          <p className="text-5xl mb-4">🏢</p>
          <p className="font-semibold">No sponsors added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-3 mb-3">
                {s.logo_url ? (
                  <img src={s.logo_url} alt={s.name} className="h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    Logo
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tierColor(s.tier)}`}>
                    {s.tier}
                  </span>
                </div>
              </div>
              {s.website && (
                <a href={s.website} target="_blank" rel="noreferrer"
                  className="text-blue-600 text-xs hover:underline block mb-3">
                  🌐 {s.website}
                </a>
              )}
              <div className="flex gap-2">
                <button onClick={() => handleEdit(s)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg text-sm font-semibold transition">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(s.id, s.name)}
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

export default SponsorsCMS;
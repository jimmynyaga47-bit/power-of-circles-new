import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function HomepageCMS() {
  const [form, setForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_button_text: "",
    hero_button_link: "",
    hero_image: "",
    welcome_title: "",
    welcome_message: "",
    about_title: "",
    about_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/homepage`);
        if (res.data) {
          setForm((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load homepage content.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/homepage`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save homepage content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Loading homepage content...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Content</h1>
        <p className="text-gray-500 mt-1">
          Edit the hero, welcome and about sections shown on the public homepage.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-300 text-green-700 rounded-xl px-4 py-3 mb-6 font-semibold">
          ✅ Homepage content saved!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🦸 Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hero Title</label>
              <input
                name="hero_title"
                value={form.hero_title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hero Subtitle</label>
              <textarea
                name="hero_subtitle"
                value={form.hero_subtitle}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg p-3"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Button Text</label>
                <input
                  name="hero_button_text"
                  value={form.hero_button_text}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Button Link</label>
                <input
                  name="hero_button_link"
                  value={form.hero_button_link}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hero Image URL</label>
              <input
                name="hero_image"
                value={form.hero_image}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">👋 Welcome Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Welcome Title</label>
              <input
                name="welcome_title"
                value={form.welcome_title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Welcome Message</label>
              <textarea
                name="welcome_message"
                value={form.welcome_message}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📖 About Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">About Title</label>
              <input
                name="about_title"
                value={form.about_title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">About Text</label>
              <textarea
                name="about_text"
                value={form.about_text}
                onChange={handleChange}
                rows="6"
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default HomepageCMS;

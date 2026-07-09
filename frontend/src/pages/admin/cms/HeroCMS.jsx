import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function HeroCMS() {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_button_text: "",
    hero_image: "",
    about_title: "",
    about_text: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    footer_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/cms/settings`);
        setForm((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/uploads/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setForm((prev) => ({ ...prev, hero_image: res.data.url }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/cms/settings`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-16 text-gray-400">Loading settings...</div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage & Site Settings</h1>
        <p className="text-gray-500 mt-1">
          Edit hero section, about text, contact details, social links and footer.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-300 text-green-700 rounded-xl px-4 py-3 mb-6 font-semibold">
          ✅ Settings saved! Public pages will update immediately.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🦸 Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Hero Title
              </label>
              <input name="hero_title" value={form.hero_title}
                onChange={handleChange}
                placeholder="Building Powerful Business Connections Across Africa"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Hero Subtitle
              </label>
              <textarea name="hero_subtitle" value={form.hero_subtitle}
                onChange={handleChange} rows={2}
                placeholder="Join Kenya's leading networking platform..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Button Text
              </label>
              <input name="hero_button_text" value={form.hero_button_text}
                onChange={handleChange}
                placeholder="Register Now"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Background Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-2 disabled:opacity-50" />
              {uploading && (
                <p className="text-sm text-blue-600 mb-2">Uploading image...</p>
              )}

              <p className="text-xs text-gray-500 mb-1">
                Or paste an image URL directly:
              </p>
              <input name="hero_image" value={form.hero_image}
                onChange={handleChange}
                placeholder="https://example.com/hero-image.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {form.hero_image && (
                <img src={form.hero_image} alt="Hero preview"
                  className="mt-2 w-full h-32 object-cover rounded-lg border" />
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">ℹ️ About Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                About Title
              </label>
              <input name="about_title" value={form.about_title}
                onChange={handleChange}
                placeholder="Who We Are"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                About Text
              </label>
              <textarea name="about_text" value={form.about_text}
                onChange={handleChange} rows={4}
                placeholder="Power of Circles in Networking Africa is a premier platform..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📞 Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input name="contact_email" value={form.contact_email}
                onChange={handleChange}
                placeholder="info@powerofcirclesinnetworking.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input name="contact_phone" value={form.contact_phone}
                onChange={handleChange}
                placeholder="+254 700 123 456"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <input name="contact_address" value={form.contact_address}
                onChange={handleChange}
                placeholder="Nairobi, Kenya"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📱 Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/powerofcircles" },
              { name: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/powerofcircles" },
              { name: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/powerofcircles" },
              { name: "twitter", label: "Twitter/X URL", placeholder: "https://twitter.com/powerofcircles" },
            ].map((s) => (
              <div key={s.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{s.label}</label>
                <input name={s.name} value={form[s.name]}
                  onChange={handleChange} placeholder={s.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🦶 Footer Text</h2>
          <textarea name="footer_text" value={form.footer_text}
            onChange={handleChange} rows={3}
            placeholder="Connecting leaders, building partnerships across Africa."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold text-lg transition disabled:opacity-60">
          {saving ? "Saving..." : "💾 Save All Settings"}
        </button>
      </form>
    </div>
  );
}

export default HeroCMS;
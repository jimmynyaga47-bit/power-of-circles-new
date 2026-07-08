import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/settings";

function Settings() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setForm(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load settings");
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await updateSettings(form);
      alert("Settings updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          name="company_name"
          placeholder="Company Name"
          value={form.company_name || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="tagline"
          placeholder="Tagline"
          value={form.tagline || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="logo"
          placeholder="Logo URL"
          value={form.logo || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="hero_image"
          placeholder="Hero Image URL"
          value={form.hero_image || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
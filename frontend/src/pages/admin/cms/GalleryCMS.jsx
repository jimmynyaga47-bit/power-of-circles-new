import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function GalleryCMS() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ url: "", type: "image", caption: "" });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const res = await axios.get(`${API}/cms/gallery`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.url) {
      alert("Please provide an image or video URL.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${API}/cms/gallery`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ url: "", type: "image", caption: "" });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to add gallery item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery item?")) return;
    try {
      await axios.delete(`${API}/cms/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete gallery item.");
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Loading gallery...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
        <p className="text-gray-500 mt-1">
          Add photos and videos shown in the public gallery / event highlights.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl shadow p-6 mb-8 grid md:grid-cols-4 gap-4 items-end"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Media URL</label>
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Caption</label>
          <input
            name="caption"
            value={form.caption}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg md:col-span-4 disabled:opacity-50"
        >
          Add to Gallery
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-gray-500">No gallery items yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow overflow-hidden">
              {item.type === "video" ? (
                <video src={item.url} controls className="w-full h-48 object-cover" />
              ) : (
                <img src={item.url} alt={item.caption || ""} className="w-full h-48 object-cover" />
              )}
              <div className="p-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">{item.caption || "—"}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GalleryCMS;

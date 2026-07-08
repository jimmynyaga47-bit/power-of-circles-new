import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent, updateEvent } from "../../services/events";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    venue: "",
    gps_location: "",
    date: "",
    time: "",
    capacity: "",
    description: "",
    banner_image: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const event = await getEvent(id);

      setForm({
        name: event.name || "",
        venue: event.venue || "",
        gps_location: event.gps_location || "",
        date: event.date ? event.date.substring(0, 10) : "",
        time: event.time || "",
        capacity: event.capacity || "",
        description: event.description || "",
        banner_image: event.banner_image || "",
        is_active: event.is_active,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load event.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateEvent(id, form);

      alert("Event updated successfully!");

      navigate("/admin/events");
    } catch (error) {
      console.error(error);
      alert("Failed to update event.");
    }
  };

  if (loading) {
    return <h2 className="p-8">Loading...</h2>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Event Name"
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border rounded-lg p-3 h-32"
        />

        <input
          name="banner_image"
          value={form.banner_image}
          onChange={handleChange}
          placeholder="Banner Image URL"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="Venue"
          className="w-full border rounded-lg p-3"
        />

        <input
          name="gps_location"
          value={form.gps_location}
          onChange={handleChange}
          placeholder="GPS Location"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="w-full border rounded-lg p-3"
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active Event
        </label>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg"
        >
          Update Event
        </button>

      </form>

    </div>
  );
}

export default EditEvent;
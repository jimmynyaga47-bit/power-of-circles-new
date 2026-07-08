import { useState } from "react";
import { createEvent } from "../../services/events";

function CreateEvent() {
  const [form, setForm] = useState({
  name: "",
  venue: "",
  gps_location: "",
  date: "",
  time: "",
  capacity: "",
  description: "",
  banner_image: "",
});

  const [loading, setLoading] = useState(false);

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

      await createEvent(form);

      alert("Event created successfully!");
setForm({
  name: "",
  venue: "",
  gps_location: "",
  date: "",
  time: "",
  capacity: "",
  description: "",
  banner_image: "",
});
    } catch (error) {
      console.error(error);
      alert("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 h-32"
          required
        />
        <input
        type="text"
        name="banner_image"
        placeholder="Banner Image URL"
         value={form.banner_image}
         onChange={handleChange}
        className="w-full border rounded-lg p-3"
        />
        

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="gps_location"
          placeholder="GPS Location"
          value={form.gps_location}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
            required
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>
    </div>
  );
}

export default CreateEvent;
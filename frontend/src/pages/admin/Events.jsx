import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "../../services/events";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await deleteEvent(id);
      alert("Event deleted successfully!");
      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to delete event.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold">Loading events...</h2>
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Manage Events
        </h1>

        <Link
          to="/admin/create-event"
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-500 text-lg">
            No events found.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Event</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Time</th>
                <th className="text-left p-4">Venue</th>
                <th className="text-left p-4">Capacity</th>
                <th className="text-left p-4">Status</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            <tbody>

              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold">
                    {event.name}
                  </td>

                  <td className="p-4">
                    {new Date(event.date).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {event.time}
                  </td>

                  <td className="p-4">
                    {event.venue}
                  </td>

                  <td className="p-4">
                    {event.capacity}
                  </td>

                  <td className="p-4">
                    {event.is_active ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">

                      <Link
                        to={`/admin/tickets/${event.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                      >
                       Manage Tickets
                      </Link>

                      <Link
                        to={`/admin/edit-event/${event.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Events;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/events";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold">
          Loading events...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-bold text-center mb-10">
        Upcoming Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          No upcoming events.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >

              <img
                src={event.banner_image}
                alt={event.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold mb-2">
                  {event.name}
                </h2>

                <p className="text-gray-600 mb-4">
                  {event.description}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>

                <p>
                  <strong>Time:</strong> {event.time}
                </p>

                <p>
                  <strong>Venue:</strong> {event.venue}
                </p>

                <Link
                  to={`/events/${event.id}/buy`}
                  className="mt-6 block w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg text-center"
                >
                  Buy Ticket
                </Link>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Events;
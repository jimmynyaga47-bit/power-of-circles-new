import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent } from "../../services/events";
import {
  getTicketTypes,
  purchaseTicket,
} from "../../services/tickets";

function BuyTicket() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const eventData = await getEvent(id);
      setEvent(eventData);

      const tickets = await getTicketTypes(id);
      setTicketTypes(tickets);
    } catch (err) {
      console.error(err);
      alert("Failed to load event.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await purchaseTicket({
      event_id: event.id,
      ticket_type_id: selectedTicket,
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone,
    });

    alert(
      `Ticket created successfully!\nTicket Number: ${response.ticket.ticket_number}`
    );

    console.log(response.ticket);

  } catch (err) {
    console.error(err);
    alert("Failed to purchase ticket.");
  }
};

  if (!event) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">

      <h1 className="text-4xl font-bold mb-2">
        {event.name}
      </h1>

      <p className="text-gray-600 mb-8">
        Purchase your ticket below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-8 space-y-5"
      >

        <input
          type="text"
          name="customer_name"
          placeholder="Full Name"
          value={form.customer_name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <select
          className="w-full border rounded-lg p-3"
          value={selectedTicket}
          onChange={(e) => setSelectedTicket(e.target.value)}
          required
        >
          <option value="">
            Select Ticket Type
          </option>

          {ticketTypes.map((ticket) => (
            <option
              key={ticket.id}
              value={ticket.id}
            >
              {ticket.name} - KSh {ticket.price}
            </option>
          ))}

        </select>

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg"
        >
          Continue to Payment
        </button>

      </form>

    </div>
  );
}

export default BuyTicket;
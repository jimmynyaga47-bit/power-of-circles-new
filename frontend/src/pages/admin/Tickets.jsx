import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTicketTypes,
  createTicketType,
} from "../../services/tickets";

function TicketTypes() {
  const { id } = useParams();

  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  const loadTicketTypes = async () => {
    try {
      const data = await getTicketTypes(id);
      setTicketTypes(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load ticket types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketTypes();
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
      await createTicketType(id, form);

      alert("Ticket type created successfully!");

      setForm({
        name: "",
        price: "",
        quantity: "",
        description: "",
      });

      loadTicketTypes();
    } catch (error) {
      console.error(error);
      alert("Failed to create ticket type.");
    }
  };

  if (loading) {
    return <h2 className="p-8">Loading...</h2>;
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Ticket Types
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-10 space-y-4"
      >
        <input
          name="name"
          placeholder="Ticket Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <button
          className="bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Add Ticket Type
        </button>

      </form>

      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Description</th>
            </tr>
          </thead>

          <tbody>

            {ticketTypes.map((ticket) => (
              <tr key={ticket.id} className="border-t">

                <td className="p-4">{ticket.name}</td>
                <td className="p-4">KSh {ticket.price}</td>
                <td className="p-4">{ticket.quantity}</td>
                <td className="p-4">{ticket.description}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TicketTypes;
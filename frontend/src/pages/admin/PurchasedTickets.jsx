import { useEffect, useState } from "react";
import { getPurchasedTickets } from "../../services/purchasedTickets";

function PurchasedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getPurchasedTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load purchased tickets.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="p-8">Loading tickets...</h2>;
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Purchased Tickets
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">Ticket No.</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Ticket Type</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Purchased</th>
            </tr>

          </thead>

          <tbody>

            {tickets.map((ticket) => (

              <tr key={ticket.id} className="border-t">

                <td className="p-4 font-semibold">
                  {ticket.ticket_number}
                </td>

                <td className="p-4">
                  {ticket.customer_name}
                  <br />
                  <span className="text-gray-500 text-sm">
                    {ticket.email}
                  </span>
                </td>

                <td className="p-4">
                  {ticket.event_name}
                </td>

                <td className="p-4">
                  {ticket.ticket_type}
                </td>

                <td className="p-4">
                  KSh {ticket.price}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      ticket.status === "paid"
                        ? "bg-green-600"
                        : ticket.status === "checked_in"
                        ? "bg-blue-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {ticket.status}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(ticket.created_at).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PurchasedTickets;
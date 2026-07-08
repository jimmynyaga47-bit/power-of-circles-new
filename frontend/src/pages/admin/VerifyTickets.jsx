import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { verifyTicket } from "../../services/verify";

function VerifyTickets() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const scannerRef = useRef(null);

  const verify = async (number) => {
    try {
      setLoading(true);

      const response = await verifyTicket({
        ticket_number: number,
      });

      setTicket(response.ticket);
      alert(response.message);
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ticketNumber) return;

    verify(ticketNumber);
  };

  useEffect(() => {
    if (!cameraOpen) return;

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        verify(decodedText);
        scannerRef.current.clear();
        setCameraOpen(false);
      },
      () => {}
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [cameraOpen]);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Verify Ticket
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Enter Ticket Number"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Verifying..." : "Verify Ticket"}
          </button>

        </form>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="text-xl font-bold mb-4">
          Scan QR Code
        </h2>

        {!cameraOpen ? (
          <button
            onClick={() => setCameraOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            📷 Open Camera
          </button>
        ) : (
          <div id="reader"></div>
        )}

      </div>

      {ticket && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Ticket Verified
          </h2>

          <p><strong>Ticket:</strong> {ticket.ticket_number}</p>
          <p><strong>Name:</strong> {ticket.customer_name}</p>
          <p><strong>Email:</strong> {ticket.email}</p>
          <p><strong>Phone:</strong> {ticket.phone}</p>
          <p><strong>Event:</strong> {ticket.event_name}</p>
          <p><strong>Ticket Type:</strong> {ticket.ticket_type}</p>
          <p><strong>Price:</strong> KSh {ticket.price}</p>

        </div>
      )}

    </div>
  );
}

export default VerifyTickets;
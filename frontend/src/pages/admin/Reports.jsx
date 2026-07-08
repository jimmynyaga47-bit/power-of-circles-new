import { useEffect, useState } from "react";
import {
  getEventReport,
  getCategoryReport,
  getCheckinReport,
} from "../../services/reports";

const CATEGORY_LABELS = {
  paid: "Paid",
  complimentary: "Complimentary",
  vip: "VIP Invitation",
  staff: "Staff",
  media: "Media",
  speaker: "Speaker",
};

function Reports() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [eventsData, categoriesData, checkinsData] = await Promise.all([
          getEventReport(),
          getCategoryReport(),
          getCheckinReport(),
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
        setCheckins(checkinsData);
      } catch (err) {
        console.error(err);
        alert("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const exportEventsCsv = () => {
    const header = "Event,Date,Venue,Tickets Sold,Revenue,Checked In,Cancelled\n";
    const rows = events
      .map(
        (e) =>
          `"${e.name}",${e.date ? new Date(e.date).toLocaleDateString() : ""},"${e.venue || ""}",${e.tickets_sold},${e.revenue},${e.checked_in},${e.cancelled}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "event-report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <h2 className="p-8">Loading reports...</h2>;
  }

  const totalRevenue = events.reduce((sum, e) => sum + Number(e.revenue), 0);
  const totalSold = events.reduce((sum, e) => sum + Number(e.tickets_sold), 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <button
          onClick={exportEventsCsv}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg"
        >
          Export Event Report (CSV)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Total Revenue (All Events)</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">
            KSh {totalRevenue.toLocaleString()}
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Total Tickets Sold</p>
          <h2 className="text-4xl font-bold mt-2">{totalSold}</h2>
        </div>
      </div>

      {/* Revenue by Event */}
      <div className="bg-white rounded-xl shadow overflow-auto mb-10">
        <h2 className="text-xl font-bold p-6 pb-0">Revenue by Event</h2>
        <table className="w-full mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Tickets Sold</th>
              <th className="p-4 text-left">Revenue</th>
              <th className="p-4 text-left">Checked In</th>
              <th className="p-4 text-left">Cancelled</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-4">{e.name}</td>
                <td className="p-4">
                  {e.date ? new Date(e.date).toLocaleDateString() : "—"}
                </td>
                <td className="p-4">{e.tickets_sold}</td>
                <td className="p-4">KSh {Number(e.revenue).toLocaleString()}</td>
                <td className="p-4">{e.checked_in}</td>
                <td className="p-4">{e.cancelled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl shadow overflow-auto mb-10">
        <h2 className="text-xl font-bold p-6 pb-0">Sales by Ticket Category</h2>
        <table className="w-full mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Tickets</th>
              <th className="p-4 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.category} className="border-t">
                <td className="p-4">{CATEGORY_LABELS[c.category] || c.category}</td>
                <td className="p-4">{c.count}</td>
                <td className="p-4">KSh {Number(c.revenue).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance / check-ins */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <h2 className="text-xl font-bold p-6 pb-0">Attendance by Event</h2>
        <table className="w-full mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Total Tickets</th>
              <th className="p-4 text-left">Checked In</th>
              <th className="p-4 text-left">Attendance Rate</th>
            </tr>
          </thead>
          <tbody>
            {checkins.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.total_tickets}</td>
                <td className="p-4">{c.checked_in}</td>
                <td className="p-4">{c.attendance_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;

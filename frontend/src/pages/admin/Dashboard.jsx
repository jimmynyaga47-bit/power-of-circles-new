import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboard";
import DashboardCharts from "../../components/dashboard/DashboardCharts";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
    totalCheckins: 0,
    totalAdmins: 0,
    pendingAdmins: 0,
    recentTickets: [],
    upcomingEvents: [],
    ticketCategories: [],
    salesTrend: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Welcome Back 👋
        </h1>

        <p className="text-slate-500 mt-2">
          Here's what's happening at Power Of Circles.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Events</p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.totalEvents}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Tickets Sold</p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.totalTickets}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">
            KSh {stats.totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Checked In</p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.totalCheckins}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Admins</p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.totalAdmins}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Pending Requests
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-2">
            {stats.pendingAdmins}
          </h2>
        </div>

      </div>

      {/* Lower Section */}

      <div className="grid lg:grid-cols-3 gap-8 mt-10">

        {/* Quick Actions */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="flex flex-col gap-4">

            <Link
              to="/admin/create-event"
              className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-center font-semibold"
            >
              ➕ Create Event
            </Link>

            <Link
              to="/admin/events"
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-center font-semibold"
            >
              📅 Manage Events
            </Link>

            <Link
              to="/admin/admins"
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-center font-semibold"
            >
              👥 Manage Admins
            </Link>

            <Link
              to="/admin/admin-requests"
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-center font-semibold"
            >
              📨 Admin Requests
            </Link>

          </div>

        </div>

        {/* Recent Ticket Sales */}

        <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">

          <h2 className="text-xl font-bold mb-6">
            Recent Ticket Purchases
          </h2>

          {stats.recentTickets.length === 0 ? (

            <p className="text-gray-500">
              No tickets purchased yet.
            </p>

          ) : (

            stats.recentTickets.map((ticket) => (

              <div
                key={ticket.ticket_number}
                className="flex justify-between border-b py-4"
              >

                <div>

                  <h3 className="font-semibold">
                    {ticket.customer_name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {ticket.event_name}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold">
                    KSh {ticket.price}
                  </p>

                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      ticket.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ticket.status}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* Upcoming Events */}

      <div className="bg-white rounded-2xl shadow p-6 mt-10">

        <h2 className="text-xl font-bold mb-6">
          Upcoming Events
        </h2>

        {stats.upcomingEvents.length === 0 ? (

          <p>No upcoming events.</p>

        ) : (

          stats.upcomingEvents.map((event) => (

            <div
              key={event.id}
              className="flex justify-between border-b py-4"
            >

              <div>

                <h3 className="font-semibold">
                  {event.name}
                </h3>

                <p className="text-gray-500">
                  {event.venue}
                </p>

              </div>

              <div>

                {new Date(event.date).toLocaleDateString()}

              </div>

            </div>

          ))

        )}

      </div>

      {/* Ticket Categories */}

      <div className="bg-white rounded-2xl shadow p-6 mt-10">

        <h2 className="text-xl font-bold mb-6">
          Ticket Categories
        </h2>

        {stats.ticketCategories.length === 0 ? (

          <p className="text-gray-500">No tickets issued yet.</p>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

            {stats.ticketCategories.map((cat) => (

              <div
                key={cat.category}
                className="bg-slate-50 rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-bold">{cat.count}</p>
                <p className="text-sm text-gray-500 capitalize mt-1">
                  {cat.category === "vip" ? "VIP Invitation" : cat.category}
                </p>
              </div>

            ))}

          </div>

        )}

      </div>

      <DashboardCharts stats={stats} />
    </div>
  );
}

export default Dashboard;
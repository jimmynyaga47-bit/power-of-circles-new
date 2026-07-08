import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const CATEGORY_LABELS = {
  paid: "Paid",
  complimentary: "Complimentary",
  vip: "VIP Invitation",
  staff: "Staff",
  media: "Media",
  speaker: "Speaker",
};

const CATEGORY_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

function DashboardCharts({ stats }) {
  const pieData = {
    labels: ["Events", "Tickets", "Check-ins", "Admins"],
    datasets: [
      {
        data: [
          stats.totalEvents,
          stats.totalTickets,
          stats.totalCheckins,
          stats.totalAdmins,
        ],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b", "#7c3aed"],
      },
    ],
  };

  const categories = stats.ticketCategories || [];
  const categoryPieData = {
    labels: categories.map((c) => CATEGORY_LABELS[c.category] || c.category),
    datasets: [
      {
        data: categories.map((c) => c.count),
        backgroundColor: categories.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
      },
    ],
  };

  const trend = stats.salesTrend || [];
  const trendData = {
    labels: trend.map((t) => t.month),
    datasets: [
      {
        label: "Tickets Sold",
        data: trend.map((t) => t.ticketsSold),
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.3,
      },
      {
        label: "Revenue (KSh)",
        data: trend.map((t) => t.revenue),
        borderColor: "#16a34a",
        backgroundColor: "#16a34a",
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  };

  const barData = {
    labels: ["Revenue"],
    datasets: [
      {
        label: "KSh",
        data: [stats.totalRevenue],
        backgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-10">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">System Overview</h2>
        <Pie data={pieData} />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Ticket Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">No data yet.</p>
        ) : (
          <Pie data={categoryPieData} />
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Sales Trend (Last 6 Months)</h2>
        {trend.length === 0 ? (
          <p className="text-gray-500">Not enough data yet.</p>
        ) : (
          <Line data={trendData} />
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Revenue</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}

export default DashboardCharts;

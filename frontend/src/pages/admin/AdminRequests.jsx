import { useEffect, useState } from "react";
import { getAdminRequests } from "../../services/AdminRequests";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem("token");

  const loadRequests = async () => {
    try {
      const data = await getAdminRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this request and create their admin account?")) return;
    try {
      await axios.put(
        `${API}/admin-requests/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Request approved! Account created with password: Welcome@2026");
      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      await axios.put(
        `${API}/admin-requests/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("❌ Request rejected.");
      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to reject request");
    }
  };

  const statusColor = (status) => ({
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  }[(status || "").toLowerCase()] || "bg-gray-100 text-gray-600");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Requests</h1>
          <p className="text-gray-500 mt-1">
            Review applications from users requesting admin access.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg transition disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-5xl mb-4">📭</p>
          <h2 className="text-xl font-semibold">No Requests Yet</h2>
          <p className="text-gray-500 mt-3">
            New admin applications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow p-6">

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                  {request.full_name?.[0] || "?"}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{request.full_name}</h2>
                  <p className="text-gray-500 text-sm">{request.email}</p>
                </div>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${statusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Phone:</strong> {request.phone || "—"}</p>
                <p><strong>Applied:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                <p><strong>Reason:</strong></p>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-600">
                  {request.reason || "No reason provided"}
                </div>
              </div>

              {/* Actions */}
              {request.status?.toLowerCase() === "pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

              {request.status?.toLowerCase() === "approved" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center text-green-700 text-sm font-semibold">
                  ✅ Approved — Account created
                </div>
              )}

              {request.status?.toLowerCase() === "rejected" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-red-600 text-sm font-semibold">
                  ❌ Rejected
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminRequests;
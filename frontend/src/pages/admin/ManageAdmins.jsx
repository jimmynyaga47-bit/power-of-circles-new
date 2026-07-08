import { useEffect, useState } from "react";
import {
  getAdmins,
  approveAdmin,
  toggleAdminStatus,
} from "../../services/admin";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);

  const loadAdmins = async () => {
  try {
    const data = await getAdmins();

    console.log("Admins received:", data);

    setAdmins(data);
  } catch (err) {
    console.error("Error loading admins:", err);

    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
    }

    alert("Failed to load admins");
  }
};

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleApprove = async (id) => {
    await approveAdmin(id);
    loadAdmins();
  };

  const handleToggle = async (id) => {
    await toggleAdminStatus(id);
    loadAdmins();
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Manage Admins
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Approved</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {admins.map((admin) => (

              <tr
                key={admin.id}
                className="border-t"
              >

                <td className="p-4">
                  {admin.name}
                </td>

                <td className="p-4">
                  {admin.email}
                </td>

                <td className="p-4">

                  {admin.approved ? (
                    <span className="text-green-600 font-semibold">
                      Approved
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}

                </td>

                <td className="p-4">

                  {admin.is_active ? (
                    <span className="text-green-600">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Disabled
                    </span>
                  )}

                </td>

                <td className="p-4 text-center space-x-2">

                  {!admin.approved && (

                    <button
                      onClick={() => handleApprove(admin.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>

                  )}

                  <button
                    onClick={() => handleToggle(admin.id)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
                  >
                    {admin.is_active ? "Deactivate" : "Activate"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ManageAdmins;
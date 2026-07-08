import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Globe,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="h-24 flex items-center justify-center border-b border-slate-800">

        <img
          src="/logo.jpeg"
          className="h-14 w-14 rounded-full mr-4"
          alt=""
        />

        <div>

          <h1 className="font-bold text-lg">
            Power Of Circles
          </h1>

          <p className="text-slate-400 text-sm">
            Administration
          </p>

        </div>

      </div>

      <div className="px-5 py-6 overflow-y-auto flex-1">

        <p className="text-xs uppercase text-slate-500 mb-3">
          MAIN MENU
        </p>

        <SidebarItem
          to="/admin"
          icon={<LayoutDashboard size={20} />}
          title="Dashboard"
        />

        <SidebarItem
          to="/admin/events"
          icon={<CalendarDays size={20} />}
          title="Events"
        />

        <SidebarItem
          to="/admin/ticket-center"
          icon={<Ticket size={20} />}
          title="Ticket Centre"
        />

        <SidebarItem
          to="/admin/purchased-tickets"
          icon={<Ticket size={20} />}
          title="Purchased Tickets"
        />

        <SidebarItem
          to="/admin/verify"
          icon={<Ticket size={20} />}
          title="Verify Tickets"
        />

        <SidebarItem
          to="/admin/content"
          icon={<Globe size={20} />}
          title="Website CMS"
        />

        <SidebarItem
          to="/admin/admins"
          icon={<Users size={20} />}
          title="Manage Admins"
        />

        <SidebarItem
          to="/admin/admin-requests"
          icon={<Users size={20} />}
          title="Admin Requests"
        />

        <SidebarItem
          to="/admin/settings"
          icon={<Settings size={20} />}
          title="Settings"
        />

        <SidebarItem
          to="/admin/reports"
          icon={<BarChart3 size={20} />}
          title="Reports"
        />

      </div>

      <div className="border-t border-slate-800 p-5">

        <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 rounded-xl py-3 transition">

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}

function SidebarItem({
  to,
  icon,
  title,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition ${
          isActive
            ? "bg-blue-600"
            : "hover:bg-slate-800"
        }`
      }
    >
      {icon}
      {title}
    </NavLink>
  );
}

export default AdminSidebar;
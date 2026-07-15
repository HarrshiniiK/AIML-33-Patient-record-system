import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_BY_ROLE = {
  ADMIN: [
    { to: "/home", label: "Dashboard", icon: "grid" },
    { to: "/patients", label: "Patients", icon: "user" },
    { to: "/doctors", label: "Doctors", icon: "stethoscope" },
    { to: "/appointments", label: "Appointments", icon: "calendar" },
    { to: "/reports", label: "Reports", icon: "chart" },
    { to: "/admin/users", label: "User Management", icon: "shield" },
    { to: "/settings", label: "Settings", icon: "gear" },
  ],
  DOCTOR: [
    { to: "/home", label: "Dashboard", icon: "grid" },
    { to: "/patients", label: "Patients", icon: "user" },
    { to: "/appointments", label: "Appointments", icon: "calendar" },
    { to: "/records", label: "Medical Records", icon: "file" },
    { to: "/reports", label: "Reports", icon: "chart" },
    { to: "/settings", label: "Settings", icon: "gear" },
  ],
  STAFF: [
    { to: "/home", label: "Dashboard", icon: "grid" },
    { to: "/patients", label: "Patients", icon: "user" },
    { to: "/appointments", label: "Appointments", icon: "calendar" },
    { to: "/records", label: "Medical Records", icon: "file" },
    { to: "/settings", label: "Settings", icon: "gear" },
  ],
  PATIENT: [
    { to: "/home", label: "My Dashboard", icon: "grid" },
    { to: "/patient-portal", label: "Patient Portal", icon: "shield" },
    { to: "/my-appointments", label: "My Appointments", icon: "calendar" },
    { to: "/prescriptions", label: "Prescriptions", icon: "file" },
    { to: "/billing", label: "Billing", icon: "chart" },
    { to: "/notifications", label: "Notifications", icon: "shield" },
    { to: "/my-records", label: "My Records", icon: "file" },
    { to: "/settings", label: "Settings", icon: "gear" },
  ],
};

const ICONS = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.5-6 8-6s8 2 8 6",
  stethoscope: "M6 4v6a4 4 0 008 0V4M10 18a4 4 0 108 0v-2M6 4H4M14 4h2",
  calendar: "M4 7h16M6 4v3M18 4v3M5 7h14v13H5zM5 11h14",
  chart: "M4 20V10M11 20V4M18 20v-7",
  shield: "M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z",
  file: "M6 3h8l4 4v14H6zM14 3v4h4",
  gear: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M4.2 4.2l2 2M17.8 17.8l2 2M2 12h3M19 12h3M4.2 19.8l2-2M17.8 6.2l2-2",
};

function Icon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_BY_ROLE[user?.role] || [];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">V</span>
        <span className="brand-name">Vitalis</span>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{user?.name?.charAt(0) || "?"}</div>
          <div>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button className="btn btn-outline btn-sm btn-block" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;


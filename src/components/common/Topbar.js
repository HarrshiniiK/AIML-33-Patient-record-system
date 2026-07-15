import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const notifications = [
  { id: 1, title: "Appointment update", message: "Your follow-up is confirmed for tomorrow.", path: "/my-appointments" },
  { id: 2, title: "Lab report ready", message: "Your latest report is available to review.", path: "/my-records" },
  { id: 3, title: "Billing notice", message: "A new invoice has been posted to your account.", path: "/billing" },
];

function Topbar({ title, subtitle, actions }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPatient = user?.role === "PATIENT" || user?.role === "patient";
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(path) {
    setOpen(false);
    navigate(path);
  }

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle muted text-sm mb-0">{subtitle}</p>}
      </div>
      <div className="flex-gap" style={{ alignItems: "center" }}>
        {isPatient && (
          <div ref={popupRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="btn btn-outline"
              aria-label="Open notifications"
              style={{ position: "relative", padding: "0.6rem 0.8rem", borderRadius: "999px" }}
            >
              <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>🔔</span>
              <span
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-2px",
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "0.1rem 0.35rem",
                  fontSize: "0.7rem",
                  lineHeight: 1,
                }}
              >
                {notifications.length}
              </span>
            </button>

            {open && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.6rem)",
                  right: 0,
                  minWidth: "280px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                  zIndex: 1000,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "0.75rem 0.9rem", borderBottom: "1px solid #f1f5f9", fontWeight: 700 }}>New updates</div>
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.path)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.8rem 0.9rem",
                      border: 0,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{item.message}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {actions && <div className="flex-gap">{actions}</div>}
      </div>
    </header>
  );
}

export default Topbar;

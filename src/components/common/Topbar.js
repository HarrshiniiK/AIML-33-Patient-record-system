import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { getNotifications, markAsRead } from "../../services/notificationService";

function Topbar({ title, subtitle, actions }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const topbarRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      const data = await getNotifications(user.patientId, user.role);
      setNotifications(data);
    };
    fetchNotifications();
    // In a real app, you'd use websockets or polling here
  }, [user, notificationsOpen]); // Refresh when dropdown opens

  useEffect(() => {
    function handleClickOutside(event) {
      if (topbarRef.current && !topbarRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSelect(notification) {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setNotificationsOpen(false);
    if (notification.path) {
      navigate(notification.path);
    }
  }



  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle muted text-sm mb-0">{subtitle}</p>}
      </div>
      <div ref={topbarRef} className="flex-gap" style={{ alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
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
                {notifications.filter(n => !n.read).length}
              </span>
            </button>

            {notificationsOpen && (
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
                {notifications.length === 0 ? (
                  <div style={{ padding: "0.8rem 0.9rem", color: "#64748b", fontSize: "0.85rem" }}>No notifications.</div>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.8rem 0.9rem",
                        border: 0,
                        background: item.read ? "#fff" : "#f8fafc",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9"
                      }}
                    >
                      <div style={{ fontWeight: item.read ? 500 : 700 }}>{item.title}</div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{item.message}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

        {actions && <div className="flex-gap">{actions}</div>}
      </div>
    </header>
  );
}

export default Topbar;

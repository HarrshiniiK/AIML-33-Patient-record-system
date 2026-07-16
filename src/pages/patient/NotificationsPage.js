import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import { useAuth } from "../../context/AuthContext";
import { getNotifications } from "../../services/notificationService";

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    getNotifications(user.patientId, user.role).then(setNotifications);
  }, [user]);

  return (
    <AppLayout>
      <Topbar title="Notifications" subtitle="Stay up to date with reminders and important updates." />

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="muted" style={{ padding: "var(--space-3)" }}>No notifications available.</p>
        ) : (
          notifications.map((alert) => (
            <div key={alert.id} className={`notification-item notification-${alert.tone || "slate"}`}>
              <strong>{alert.title}</strong>
              <div className="muted text-sm">{alert.message}</div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}

export default NotificationsPage;

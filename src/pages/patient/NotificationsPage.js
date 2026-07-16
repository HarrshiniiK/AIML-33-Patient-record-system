import React from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";

const alerts = [
  { id: 1, title: "Appointment reminder", detail: "Your follow-up consultation is tomorrow at 10:00 AM.", tone: "teal" },
  { id: 2, title: "Lab report ready", detail: "Your lipid panel report is now available for download.", tone: "amber" },
  { id: 3, title: "Payment due", detail: "Invoice INV-1043 is due by July 20.", tone: "coral" },
];

function NotificationsPage() {
  return (
    <AppLayout>
      <Topbar title="Notifications" subtitle="Stay up to date with reminders and important updates." />

      <div className="notification-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`notification-item notification-${alert.tone}`}>
            <strong>{alert.title}</strong>
            <div className="muted text-sm">{alert.detail}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default NotificationsPage;

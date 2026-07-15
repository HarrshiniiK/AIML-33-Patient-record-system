import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { EmptyState } from "../../components/common/Modal";
import { getAppointmentsForPatient } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    if (user.patientId) getAppointmentsForPatient(user.patientId).then(setAppointments);
    else setAppointments([]);
  }, [user.patientId]);

  if (!appointments) return <AppLayout><Loader label="Loading your appointments" /></AppLayout>;

  return (
    <AppLayout>
      <Topbar title="My appointments" subtitle="Your scheduled and past visits." />
      {appointments.length === 0 ? (
        <EmptyState title="No appointments yet" message="Once your care team schedules a visit, it will appear here." />
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.doctorName}</td>
                  <td className="mono">{a.date}</td>
                  <td className="mono">{a.time}</td>
                  <td>{a.reason}</td>
                  <td><span className={`badge ${a.status === "Confirmed" ? "badge-teal" : "badge-amber"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}

export default MyAppointments;

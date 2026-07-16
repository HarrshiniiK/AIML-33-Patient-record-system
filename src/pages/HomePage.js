import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/common/AppLayout";
import Topbar from "../components/common/Topbar";
import Loader from "../components/common/Loader";
import StatCard from "../components/common/StatCard";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import { getAppointments, getAppointmentsForPatient } from "../services/appointmentService";
import { getRecordsForPatient } from "../services/recordService";
import { Link } from "react-router-dom";

const patientQuickLinks = [
  { to: "/my-appointments", label: "Book Appointment" },
  { to: "/my-records", label: "View Prescriptions" },
  { to: "/billing", label: "Billing" },
  { to: "/my-records", label: "Lab Reports" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StaffDashboard({ user }) {
  const [data, setData] = useState(null);
  const isDoctor = user.role === "DOCTOR";

  useEffect(() => {
    Promise.all([getPatients(), getDoctors(), getAppointments()]).then(([allPatients, doctors, allAppointments]) => {
      const patients = isDoctor ? allPatients.filter((p) => p.assignedDoctor === user.name) : allPatients;
      const appointments = isDoctor ? allAppointments.filter((a) => a.doctorName === user.name) : allAppointments;
      setData({ patients, doctors, appointments });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return <Loader label="Loading dashboard" />;

  const admitted = data.patients.filter((p) => p.status === "Admitted").length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysAppointments = data.appointments.filter((a) => a.date === todayStr);
  const pending = data.appointments.filter((a) => a.status === "Pending").length;

  return (
    <>
      {isDoctor && (
        <div className="badge badge-teal" style={{ marginBottom: "var(--space-4)" }}>
          Showing only your assigned patients and appointments
        </div>
      )}
      <div className="stats-grid">
        <StatCard label={isDoctor ? "Your patients" : "Total patients"} value={data.patients.length} accent="navy" />
        <StatCard label="Currently admitted" value={admitted} accent="teal" />
        <StatCard label="Appointments today" value={todaysAppointments.length} accent="amber" />
        <StatCard label="Pending confirmations" value={pending} accent="coral" />
      </div>

      <div className="card card-pad">
        <div className="section-header">
          <h3 className="mb-0">Upcoming appointments</h3>
          <Link to="/appointments" className="text-sm">View all →</Link>
        </div>
        {data.appointments.length === 0 ? (
          <p className="muted mb-0">No appointments to show.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data.appointments.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td>{a.patientName}</td>
                    <td>{a.doctorName}</td>
                    <td className="mono">{a.date}</td>
                    <td className="mono">{a.time}</td>
                    <td><span className={`badge ${a.status === "Confirmed" ? "badge-teal" : "badge-amber"}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function PatientDashboardHome({ user }) {
  const [appointments, setAppointments] = useState(null);
  const [records, setRecords] = useState(null);

  useEffect(() => {
    if (!user.patientId) return;
    getAppointmentsForPatient(user.patientId).then(setAppointments);
    getRecordsForPatient(user.patientId).then(setRecords);
  }, [user.patientId]);

  if (!appointments || !records) return <Loader label="Loading your dashboard" />;

  const upcoming = appointments.filter((a) => new Date(a.date) >= new Date());

  return (
    <>
      <div className="card card-pad" style={{ marginBottom: "var(--space-4)" }}>
        <div className="section-header">
          <h3 className="mb-0">Hello, {user.name.split(" ")[0]}</h3>
          <span className="badge badge-teal">Patient dashboard</span>
        </div>
        <p className="muted mb-0">Manage your appointments, prescriptions, billing, and health updates from one place.</p>
        <div className="portal-actions" style={{ marginTop: "var(--space-3)" }}>
          {patientQuickLinks.map((link) => (
            <Link key={link.to + link.label} to={link.to} className="btn btn-outline btn-sm">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Upcoming appointments" value={upcoming.length} accent="teal" />
        <StatCard label="Records on file" value={records.length} accent="navy" />
      </div>

      <div className="portal-grid">
        <div className="card card-pad portal-section">
          <div className="section-header">
            <h3 className="mb-0">Upcoming appointments</h3>
            <Link to="/my-appointments" className="text-sm">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="muted mb-0">No upcoming appointments scheduled.</p>
          ) : (
            <ul className="portal-list">
              {upcoming.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <div className="portal-list-title">{a.reason}</div>
                  <div className="muted text-sm">{a.doctorName} · {a.date} · {a.time}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card card-pad portal-section">
          <div className="section-header">
            <h3 className="mb-0">Notifications</h3>
            <Link to="/notifications" className="text-sm">View all →</Link>
          </div>
          <div className="notification-list">
            <div className="notification-item notification-teal">
              <strong>Medication refill</strong>
              <div className="muted text-sm">Your refill request is ready for review.</div>
            </div>
            <div className="notification-item notification-amber">
              <strong>Appointment reminder</strong>
              <div className="muted text-sm">Your next visit is scheduled for tomorrow morning.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: "var(--space-4)" }}>
        <div className="section-header">
          <h3 className="mb-0">Recent records</h3>
          <Link to="/my-records" className="text-sm">View all →</Link>
        </div>
        {records.slice(0, 3).map((r) => (
          <div key={r.id} className="record-row">
            <div>
              <strong>{r.title}</strong>
              <div className="muted text-sm">{r.type} · {r.date} · {r.doctor}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function HomePage() {
  const { user } = useAuth();
  const isPatient = user.role === "PATIENT";

  return (
    <AppLayout>
      <Topbar
        title={`${greeting()}, ${user.name.split(" ")[0]}`}
        subtitle={isPatient ? "Here's what's happening with your care." : "Here's what's happening across the ward today."}
      />
      {isPatient ? <PatientDashboardHome user={user} /> : <StaffDashboard user={user} />}
    </AppLayout>
  );
}

export default HomePage;

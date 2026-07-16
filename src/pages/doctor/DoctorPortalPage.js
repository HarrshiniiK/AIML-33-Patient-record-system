import React from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/common/StatCard";
import { useAuth } from "../../context/AuthContext";

const assignedPatients = [
  { id: "PT-204", name: "Daniel Osei", condition: "Stable hypertension", status: "Follow-up due", note: "BP improving" },
  { id: "PT-218", name: "Jane Smith", condition: "Type 2 diabetes", status: "Medication review", note: "Glucose trending down" },
  { id: "PT-229", name: "Noah Becker", condition: "Coronary artery disease", status: "Post-op care", note: "Echo planned" },
  { id: "PT-231", name: "Amara Diallo", condition: "Asthma flare-up", status: "Recovery", note: "Spirometry pending" },
];

const appointmentItems = [
  { id: 1, patient: "Daniel Osei", time: "08:30", note: "Blood pressure review", status: "Confirmed" },
  { id: 2, patient: "Jane Smith", time: "10:15", note: "Medication follow-up", status: "Pending" },
  { id: 3, patient: "Noah Becker", time: "13:45", note: "Cardiology consult", status: "Reschedule" },
];

const prescriptionItems = [
  { id: 1, patient: "Daniel Osei", medication: "Amlodipine", dosage: "5 mg", duration: "30 days", note: "Continue once daily" },
  { id: 2, patient: "Jane Smith", medication: "Metformin XR", dosage: "500 mg", duration: "14 days", note: "Take with meals" },
  { id: 3, patient: "Amara Diallo", medication: "Albuterol", dosage: "2 puffs", duration: "7 days", note: "PRN for flare-ups" },
];

const labReports = [
  { id: 1, patient: "Daniel Osei", type: "Lipid panel", status: "Pending review" },
  { id: 2, patient: "Jane Smith", type: "HbA1c", status: "Completed" },
  { id: 3, patient: "Noah Becker", type: "Troponin", status: "Urgent follow-up" },
];

const messages = [
  { id: 1, title: "Care team update", sender: "Nursing desk", detail: "Patient requested an earlier blood pressure check." },
  { id: 2, title: "Lab result uploaded", sender: "Lab team", detail: "New test results are ready for review." },
  { id: 3, title: "Referral request", sender: "Radiology", detail: "Echo schedule confirmation is pending." },
];

function DoctorPortalPage() {
  const { user } = useAuth();
  const doctorName = user?.name?.split(" ")[0] || "Doctor";
  const stats = {
    appointments: appointmentItems.length,
    pendingLabs: labReports.filter((report) => report.status.toLowerCase().includes("pending") || report.status.toLowerCase().includes("urgent")).length,
    messages: messages.length,
    schedule: "08:30–17:00",
  };

  return (
    <div className="doctor-portal-shell">
      <div className="card card-pad doctor-portal-banner">
        <div className="section-header">
          <div>
            <h2 className="mb-0">Welcome, Dr. {doctorName}</h2>
            <p className="muted mb-0">Review today’s priorities, appointments, lab updates, and patient messages from one workspace.</p>
          </div>
          <span className="badge badge-teal">Specialist view</span>
        </div>
      </div>

      <div className="card card-pad">
        <div className="section-header">
          <h3 className="mb-0">Quick Stats</h3>
        </div>
        <div className="stats-grid">
          <StatCard label="Today’s Appointments" value={stats.appointments} accent="navy" />
          <StatCard label="Pending Lab Reports" value={stats.pendingLabs} accent="teal" />
          <StatCard label="New Messages" value={stats.messages} accent="amber" />
          <StatCard label="My Schedule" value={stats.schedule} accent="coral" hint="Clinic hours" />
        </div>
      </div>

      <div className="doctor-portal-grid">
        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Notifications</h3>
            <span className="badge badge-amber">Alerts</span>
          </div>
          <div className="doctor-portal-list">
            <div className="doctor-portal-list-item notification-teal">
              <strong>Upcoming appointment</strong>
              <div className="muted text-sm">Daniel Osei is due for a blood pressure review at 08:30.</div>
            </div>
            <div className="doctor-portal-list-item notification-amber">
              <strong>Lab result available</strong>
              <div className="muted text-sm">Jane Smith’s HbA1c report is ready for your review.</div>
            </div>
            <div className="doctor-portal-list-item">
              <strong>Secure message</strong>
              <div className="muted text-sm">A referral request from Radiology requires your confirmation.</div>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Assigned patients</h3>
            <Link to="/patients" className="text-sm">Open records</Link>
          </div>
          <ul className="portal-list">
            {assignedPatients.map((patient) => (
              <li key={patient.id}>
                <div className="portal-list-title">{patient.name}</div>
                <div className="muted text-sm">{patient.condition} · {patient.status}</div>
                <div className="muted text-sm">{patient.note}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="doctor-portal-grid">
        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Today’s appointments</h3>
            <Link to="/appointments" className="text-sm">Open calendar</Link>
          </div>
          <ul className="portal-list">
            {appointmentItems.map((item) => (
              <li key={item.id}>
                <div className="portal-list-title">{item.patient} · {item.time}</div>
                <div className="muted text-sm">{item.note} · {item.status}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Appointment actions</h3>
            <Link to="/appointments" className="text-sm">Open calendar</Link>
          </div>
          <div className="portal-actions">
            <button type="button" className="btn btn-outline btn-sm">Approve</button>
            <button type="button" className="btn btn-outline btn-sm">Reschedule</button>
            <button type="button" className="btn btn-outline btn-sm">Mark complete</button>
            <button type="button" className="btn btn-outline btn-sm">Visit summary</button>
          </div>
        </div>
      </div>

      <div className="doctor-portal-grid">
        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Prescriptions</h3>
            <button type="button" className="btn btn-outline btn-sm">Create prescription</button>
          </div>
          <div className="doctor-portal-list">
            {prescriptionItems.map((item) => (
              <div key={item.id} className="doctor-portal-list-item">
                <div className="portal-list-title">{item.patient}</div>
                <div className="muted text-sm">{item.medication} · {item.dosage} · {item.duration}</div>
                <div className="muted text-sm">{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Lab reports</h3>
            <button type="button" className="btn btn-outline btn-sm">Request tests</button>
          </div>
          <div className="doctor-portal-list">
            {labReports.map((report) => (
              <div key={report.id} className="doctor-portal-list-item">
                <div className="portal-list-title">{report.patient} · {report.type}</div>
                <div className="muted text-sm">{report.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="doctor-portal-grid">
        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Messages</h3>
            <button type="button" className="btn btn-outline btn-sm">Send follow-up</button>
          </div>
          <div className="doctor-portal-list">
            {messages.map((message) => (
              <div key={message.id} className="doctor-portal-list-item">
                <div className="portal-list-title">{message.title}</div>
                <div className="muted text-sm">{message.sender} · {message.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-header">
            <h3 className="mb-0">Profile & analytics</h3>
            <Link to="/reports" className="text-sm">Open reports</Link>
          </div>
          <div className="doctor-portal-list">
            <div className="doctor-portal-list-item">
              <div className="portal-list-title">Dr. {doctorName}</div>
              <div className="muted text-sm">Cardiology · 12 years in practice</div>
            </div>
            <div className="doctor-portal-list-item">
              <div className="portal-list-title">Consultation hours</div>
              <div className="muted text-sm">08:30–12:30 · 14:00–17:00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-pad doctor-portal-footer">
        <div>
          <strong>Hospital contact</strong>
          <div className="muted text-sm">Main Clinic · +1 (555) 012-345 · privacy@vitalis.example</div>
        </div>
        <div className="portal-actions">
          <button type="button" className="btn btn-outline btn-sm">Privacy policy</button>
          <button type="button" className="btn btn-outline btn-sm">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default DoctorPortalPage;

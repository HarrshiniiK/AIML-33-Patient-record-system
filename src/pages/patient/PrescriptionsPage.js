import React from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";

const prescriptions = [
  {
    patient: "Daniel Osei",
    medication: "Amlodipine",
    dosage: "5 mg",
    duration: "30 days",
    status: "Active",
    notes: "Continue once daily and monitor blood pressure.",
  },
  {
    patient: "Jane Smith",
    medication: "Metformin XR",
    dosage: "500 mg",
    duration: "14 days",
    status: "Pending review",
    notes: "Take with meals and review glucose trend.",
  },
];

function PrescriptionsPage() {
  return (
    <AppLayout>
      <Topbar title="Prescriptions" subtitle="Create new prescriptions, review past orders, and manage refill requests." />

      <div className="card card-pad" style={{ marginBottom: "var(--space-4)" }}>
        <div className="section-header">
          <h3 className="mb-0">Create new prescription</h3>
          <button className="btn btn-outline btn-sm">Add prescription</button>
        </div>
        <div className="doctor-portal-search-row">
          <select className="search-input" defaultValue="">
            <option value="" disabled>Select patient</option>
            <option value="daniel">Daniel Osei</option>
            <option value="jane">Jane Smith</option>
            <option value="amara">Amara Diallo</option>
          </select>
          <input className="search-input" placeholder="Medication" defaultValue="" />
          <input className="search-input" placeholder="Dosage" defaultValue="" />
          <input className="search-input" placeholder="Duration" defaultValue="" />
        </div>
      </div>

      <div className="doctor-portal-list">
        {prescriptions.map((item) => (
          <div key={item.patient + item.medication} className="card card-pad doctor-portal-list-item">
            <div className="section-header">
              <div>
                <div className="portal-list-title">{item.patient}</div>
                <div className="muted text-sm">{item.medication}</div>
              </div>
              <span className="badge badge-teal">{item.status}</span>
            </div>
            <div className="detail-list">
              <div>
                <dt>Dosage</dt>
                <dd>{item.dosage}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{item.duration}</dd>
              </div>
              <div>
                <dt>Notes</dt>
                <dd>{item.notes}</dd>
              </div>
            </div>
            <div className="portal-actions" style={{ marginTop: "var(--space-3)" }}>
              <button className="btn btn-outline btn-sm">Approve refill</button>
              <button className="btn btn-outline btn-sm">Attach notes</button>
              <button className="btn btn-outline btn-sm">Lab reference</button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default PrescriptionsPage;

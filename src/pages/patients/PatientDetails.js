import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { getPatient } from "../../services/patientService";
import { getAppointmentsForPatient } from "../../services/appointmentService";
import { getRecordsForPatient } from "../../services/recordService";
import { useAuth } from "../../context/AuthContext";

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const { user } = useAuth();
  const canEditDemographics = ["ADMIN", "STAFF"].includes(user.role);
  const canAddRecord = ["ADMIN", "DOCTOR"].includes(user.role);

  useEffect(() => {
    getPatient(id).then(setPatient);
    getAppointmentsForPatient(id).then(setAppointments);
    getRecordsForPatient(id).then(setRecords);
  }, [id]);

  if (!patient) return <AppLayout><Loader label="Loading patient" /></AppLayout>;

  return (
    <AppLayout>
      <Topbar
        title={`${patient.firstName} ${patient.lastName}`}
        subtitle={`Patient ID: ${patient.id}`}
        actions={
          <div className="flex-gap">
            {canAddRecord && <Link to={`/records?patientId=${patient.id}`} className="btn btn-accent">+ Add medical record</Link>}
            {canEditDemographics && <Link to={`/patients/edit/${patient.id}`} className="btn btn-outline">Edit demographics</Link>}
          </div>
        }
      />

      <div className="details-grid">
        <div className="card card-pad">
          <h3>Patient information</h3>
          <dl className="detail-list">
            <div><dt>Gender</dt><dd>{patient.gender || "—"}</dd></div>
            <div><dt>Date of birth</dt><dd className="mono">{patient.dob || "—"}</dd></div>
            <div><dt>Blood group</dt><dd className="mono">{patient.bloodGroup || "—"}</dd></div>
            <div><dt>Phone</dt><dd>{patient.phone || "—"}</dd></div>
            <div><dt>Email</dt><dd>{patient.email || "—"}</dd></div>
            <div><dt>Address</dt><dd>{patient.address || "—"}</dd></div>
            <div><dt>Diagnosis</dt><dd>{patient.disease || "—"}</dd></div>
            <div><dt>Status</dt><dd><span className="badge badge-teal">{patient.status || "—"}</span></dd></div>
            <div><dt>Assigned doctor</dt><dd>{patient.assignedDoctor || "—"}</dd></div>
            <div><dt>Admitted</dt><dd className="mono">{patient.admittedDate || "—"}</dd></div>
          </dl>
        </div>

        <div>
          <div className="card card-pad" style={{ marginBottom: "var(--space-4)" }}>
            <h3>Appointments</h3>
            {appointments.length === 0 ? (
              <p className="muted mb-0">No appointments on record.</p>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="record-row">
                  <div>
                    <strong>{a.reason}</strong>
                    <div className="muted text-sm">{a.doctorName} · {a.date} at {a.time}</div>
                  </div>
                  <span className={`badge ${a.status === "Confirmed" ? "badge-teal" : "badge-amber"}`}>{a.status}</span>
                </div>
              ))
            )}
          </div>

          <div className="card card-pad">
            <h3>Medical records</h3>
            {records.length === 0 ? (
              <p className="muted mb-0">No records on file.</p>
            ) : (
              records.map((r) => (
                <div key={r.id} className="record-row">
                  <div>
                    <strong>{r.title}</strong>
                    <div className="muted text-sm">{r.type} · {r.date} · {r.doctor}</div>
                    <p className="text-sm mb-0" style={{ marginTop: 4 }}>{r.notes}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Link to="/patients" className="text-sm" style={{ display: "inline-block", marginTop: "var(--space-5)" }}>
        ← Back to patient list
      </Link>
    </AppLayout>
  );
}

export default PatientDetails;

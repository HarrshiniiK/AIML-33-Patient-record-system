import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { EmptyState } from "../../components/common/Modal";
import { getRecordsForPatient } from "../../services/recordService";
import { useAuth } from "../../context/AuthContext";

const TYPE_BADGE = { Prescription: "badge-teal", "Lab Report": "badge-amber", Imaging: "badge-slate" };

function MyRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState(null);

  useEffect(() => {
    if (user.patientId) getRecordsForPatient(user.patientId).then(setRecords);
    else setRecords([]);
  }, [user.patientId]);

  if (!records) return <AppLayout><Loader label="Loading your records" /></AppLayout>;

  return (
    <AppLayout>
      <Topbar title="My medical records" subtitle="Prescriptions, lab reports, and imaging on file." />
      {records.length === 0 ? (
        <EmptyState title="No records yet" message="Your medical history will show up here once your care team adds entries." />
      ) : (
        <div className="records-list">
          {records.map((r) => (
            <div key={r.id} className="card card-pad record-card">
              <span className={`badge ${TYPE_BADGE[r.type] || "badge-slate"}`}>{r.type}</span>
              <h3 style={{ marginTop: 8 }}>{r.title}</h3>
              <div className="muted text-sm">{r.date} · {r.doctor}</div>
              <p className="text-sm mb-0" style={{ marginTop: "var(--space-3)" }}>{r.notes}</p>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

export default MyRecords;

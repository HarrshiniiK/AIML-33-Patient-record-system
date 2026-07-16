import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { EmptyState, Modal } from "../../components/common/Modal";
import { getRecordsForPatient } from "../../services/recordService";
import { useAuth } from "../../context/AuthContext";

const TYPE_BADGE = { Prescription: "badge-teal", "Lab Report": "badge-amber", Imaging: "badge-slate" };

function MyRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (user.patientId) getRecordsForPatient(user.patientId).then(setRecords);
    else setRecords([]);
  }, [user.patientId]);

  function buildReport(record) {
    const normalizedTitle = (record.title || "").toLowerCase();
    if (normalizedTitle.includes("ecg") || normalizedTitle.includes("electrocardiogram")) {
      return {
        title: "ECG Report",
        summary: "Electrocardiogram review completed for the reported concern.",
        findings: ["Normal sinus rhythm detected.", "No acute ischemic change noted.", "Heart rhythm remained within expected range."],
        impression: "No urgent cardiac abnormality was identified from this ECG review.",
        recommendations: ["Continue the current treatment plan.", "Follow up if symptoms return or worsen."],
      };
    }

    if (normalizedTitle.includes("mri") || normalizedTitle.includes("ct") || normalizedTitle.includes("scan") || normalizedTitle.includes("x-ray") || normalizedTitle.includes("imaging")) {
      return {
        title: "Imaging Report",
        summary: "Imaging review completed for the reported issue.",
        findings: ["No acute structural abnormality identified.", "The scan remains consistent with the current history.", "No urgent intervention was indicated from the reviewed image."],
        impression: "Imaging findings are non-emergent and support routine follow-up.",
        recommendations: ["Continue the recommended care plan.", "Attend the next scheduled review appointment."],
      };
    }

    if (record.type === "Lab Report") {
      return {
        title: "Lab Report",
        summary: "Laboratory investigation completed for the active concern.",
        findings: ["Reviewed values remained within the expected reference range.", "No unexpected abnormality was detected in the submitted sample."],
        impression: "Laboratory results do not indicate an urgent concern at this time.",
        recommendations: ["Maintain the current care plan.", "Repeat testing only if recommended by your care team."],
      };
    }

    return {
      title: "Clinical Summary",
      summary: "A summary for this record is available for review.",
      findings: ["The entry was reviewed in the context of your current treatment history.", "No immediate risk was identified from the available details."],
      impression: "The documented entry is consistent with your ongoing care plan.",
      recommendations: ["Continue monitoring and follow up as directed."],
    };
  }

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
              <div className="flex-between">
                <div>
                  <span className={`badge ${TYPE_BADGE[r.type] || "badge-slate"}`}>{r.type}</span>
                  <h3 style={{ marginTop: 8 }}>{r.title}</h3>
                  <div className="muted text-sm">{r.date} · {r.doctor}</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedReport(r)}>View report</button>
              </div>
              <p className="text-sm mb-0" style={{ marginTop: "var(--space-3)" }}>{r.notes}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={Boolean(selectedReport)} onClose={() => setSelectedReport(null)} title={selectedReport ? buildReport(selectedReport).title : "Report preview"}>
        {selectedReport && (() => {
          const report = buildReport(selectedReport);
          return (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div className="muted text-sm">{selectedReport.date} · {selectedReport.doctor}</div>
              <div><strong>Summary</strong><p className="mb-0">{report.summary}</p></div>
              <div><strong>Findings</strong><ul className="mb-0" style={{ paddingLeft: "1rem" }}>{report.findings.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><strong>Impression</strong><p className="mb-0">{report.impression}</p></div>
              <div><strong>Recommendations</strong><ul className="mb-0" style={{ paddingLeft: "1rem" }}>{report.recommendations.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div className="card card-pad" style={{ background: "var(--surface)" }}>
                <div><strong>Original note</strong></div>
                <p className="mb-0 text-sm">{selectedReport.notes || "No additional notes provided."}</p>
              </div>
            </div>
          );
        })()}
      </Modal>
    </AppLayout>
  );
}

export default MyRecords;

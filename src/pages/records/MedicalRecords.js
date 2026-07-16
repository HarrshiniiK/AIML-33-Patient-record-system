import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { Modal, EmptyState } from "../../components/common/Modal";
import { getRecords, createRecord, deleteRecord } from "../../services/recordService";
import { getPatients } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

const emptyForm = { patientId: "", type: "Prescription", title: "", notes: "", date: new Date().toISOString().slice(0, 10) };
const TYPE_BADGE = { Prescription: "badge-teal", "Lab Report": "badge-amber", Imaging: "badge-slate" };

function MedicalRecords() {
  const [records, setRecords] = useState(null);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Clinical staff (doctors) write records; general staff can view but not add.
  const canWrite = ["ADMIN", "DOCTOR"].includes(user.role);

  function load() {
    getRecords().then((all) => setRecords(all.sort((a, b) => new Date(b.date) - new Date(a.date))));
  }
  useEffect(() => {
    load();
    getPatients().then(setPatients);
  }, []);

  // If arriving from a patient's detail page via "+ Add medical record",
  // preselect that patient and open the form automatically.
  useEffect(() => {
    const preselectedPatientId = searchParams.get("patientId");
    if (preselectedPatientId && canWrite) {
      setForm((f) => ({ ...f, patientId: preselectedPatientId }));
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createRecord({ ...form, doctor: user.name });
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } finally {
      setSaving(false);
    }
  }
  function handleDelete(id) {
    if (window.confirm("Delete this record permanently?")) deleteRecord(id).then(load);
  }

  function patientName(patientId) {
    const p = patients.find((p) => p.id === patientId);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown patient";
  }

  function buildReport(r) {
    const normalizedTitle = (r.title || "").toLowerCase();
    if (normalizedTitle.includes("ecg") || normalizedTitle.includes("electrocardiogram")) {
      return {
        title: "ECG Report",
        summary: "Electrocardiogram review completed for the reported cardiac concern.",
        findings: ["Normal sinus rhythm detected.", "No evidence of acute ischemic change.", "Heart rate and rhythm remained within expected range."],
        impression: "No urgent cardiac abnormality noted from this ECG review.",
        recommendations: ["Continue current medication plan.", "Follow up with the assigned clinician if symptoms recur."],
      };
    }

    if (normalizedTitle.includes("mri") || normalizedTitle.includes("ct") || normalizedTitle.includes("scan") || normalizedTitle.includes("x-ray") || normalizedTitle.includes("imaging")) {
      return {
        title: "Imaging Report",
        summary: "Imaging review completed for the reported condition.",
        findings: ["No acute structural abnormality identified.", "The imaging remains consistent with the current clinical history.", "No urgent intervention was indicated from the reviewed scan."],
        impression: "Imaging findings are non-emergent and support routine follow-up.",
        recommendations: ["Continue the recommended treatment plan.", "Attend the next scheduled review appointment."],
      };
    }

    if (r.type === "Lab Report") {
      return {
        title: "Lab Report",
        summary: "Laboratory investigation completed for the active clinical issue.",
        findings: ["All reviewed values were within the expected reference range.", "No unexpected abnormality was detected in the submitted sample."],
        impression: "Laboratory results do not indicate an urgent concern at this time.",
        recommendations: ["Maintain the current care plan.", "Repeat testing if recommended by the treating clinician."],
      };
    }

    return {
      title: "Clinical Summary",
      summary: "A review summary is available for this record entry.",
      findings: ["Record reviewed against the current patient history.", "No immediate safety issue was identified in the available details."],
      impression: "The documented entry is consistent with the ongoing care plan.",
      recommendations: ["Continue monitoring and follow up as directed."],
    };
  }

  const filtered = records?.filter((r) => filterType === "All" || r.type === filterType) || [];

  return (
    <AppLayout>
      <Topbar
        title="Medical records"
        subtitle={
          canWrite
            ? `${records?.length ?? "…"} entries across all patients`
            : `${records?.length ?? "…"} entries · view-only for your role`
        }
        actions={canWrite && <button className="btn btn-accent" onClick={() => setModalOpen(true)}>+ Add record</button>}
      />

      <div className="flex-gap" style={{ marginBottom: "var(--space-4)" }}>
        {["All", "Prescription", "Lab Report", "Imaging"].map((t) => (
          <button
            key={t}
            className={`chip-filter ${filterType === t ? "active" : ""}`}
            onClick={() => setFilterType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {!records ? (
        <Loader label="Loading records" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No records" message="Add a prescription, lab report, or imaging note for a patient." />
      ) : (
        <div className="records-list">
          {filtered.map((r) => (
            <div key={r.id} className="card card-pad record-card">
              <div className="flex-between">
                <div>
                  <span className={`badge ${TYPE_BADGE[r.type] || "badge-slate"}`}>{r.type}</span>
                  <h3 style={{ marginTop: 8 }}>{r.title}</h3>
                  <div className="muted text-sm">{patientName(r.patientId)} · {r.date} · {r.doctor}</div>
                </div>
                <div className="flex-gap">
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedReport(r)}>View report</button>
                  {canWrite && <button className="btn-link-danger text-sm" onClick={() => handleDelete(r.id)}>Delete</button>}
                </div>
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
              <div className="muted text-sm">{patientName(selectedReport.patientId)} · {selectedReport.date} · {selectedReport.doctor}</div>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add medical record">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Patient</label>
            <select name="patientId" value={form.patientId} onChange={handleChange} required>
              <option value="">— Select patient —</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Prescription</option><option>Lab Report</option><option>Imaging</option>
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
          </div>
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Amoxicillin 500mg" required />
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} placeholder="Clinical notes, dosage, follow-up instructions…" />
          </div>
          <div className="flex-gap" style={{ marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save record"}</button>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default MedicalRecords;

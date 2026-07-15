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
                {canWrite && <button className="btn-link-danger text-sm" onClick={() => handleDelete(r.id)}>Delete</button>}
              </div>
              <p className="text-sm mb-0" style={{ marginTop: "var(--space-3)" }}>{r.notes}</p>
            </div>
          ))}
        </div>
      )}

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

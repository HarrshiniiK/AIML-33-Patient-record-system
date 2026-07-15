import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { Modal, EmptyState } from "../../components/common/Modal";
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from "../../services/doctorService";

const emptyDoctor = { name: "", specialization: "", phone: "", email: "", experience: "", availability: "" };

function DoctorList() {
  const [doctors, setDoctors] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyDoctor);
  const [saving, setSaving] = useState(false);

  function load() {
    getDoctors().then(setDoctors);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyDoctor);
    setModalOpen(true);
  }
  function openEdit(doctor) {
    setEditing(doctor);
    setForm(doctor);
    setModalOpen(true);
  }
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateDoctor(editing.id, form);
      else await createDoctor(form);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }
  function handleDelete(id, name) {
    if (window.confirm(`Remove ${name} from the doctor roster?`)) {
      deleteDoctor(id).then(load);
    }
  }

  return (
    <AppLayout>
      <Topbar
        title="Doctors"
        subtitle={`${doctors?.length ?? "…"} on the roster`}
        actions={<button className="btn btn-accent" onClick={openAdd}>+ Add doctor</button>}
      />

      {!doctors ? (
        <Loader label="Loading doctors" />
      ) : doctors.length === 0 ? (
        <EmptyState title="No doctors yet" message="Add your first doctor to the roster." />
      ) : (
        <div className="doctor-grid">
          {doctors.map((d) => (
            <div key={d.id} className="card card-pad doctor-card">
              <div className="avatar" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
                {d.name.replace("Dr. ", "").charAt(0)}
              </div>
              <h3 style={{ marginTop: "var(--space-3)" }}>{d.name}</h3>
              <span className="badge badge-teal">{d.specialization}</span>
              <dl className="detail-list" style={{ marginTop: "var(--space-3)" }}>
                <div><dt>Experience</dt><dd>{d.experience} yrs</dd></div>
                <div><dt>Phone</dt><dd>{d.phone}</dd></div>
                <div><dt>Email</dt><dd>{d.email}</dd></div>
                <div><dt>Availability</dt><dd>{d.availability}</dd></div>
              </dl>
              <div className="flex-gap" style={{ marginTop: "var(--space-3)" }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(d)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id, d.name)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit doctor" : "Add doctor"}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. Jane Doe" required />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Specialization</label>
              <input name="specialization" value={form.specialization} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Experience (yrs)</label>
              <input type="number" min="0" name="experience" value={form.experience} onChange={handleChange} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className="field">
            <label>Availability</label>
            <input name="availability" value={form.availability} onChange={handleChange} placeholder="e.g. Mon-Fri, 9AM-4PM" />
          </div>
          <div className="flex-gap" style={{ marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editing ? "Update doctor" : "Add doctor"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default DoctorList;

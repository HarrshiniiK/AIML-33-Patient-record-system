import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { Modal, EmptyState } from "../../components/common/Modal";
import {
  getAppointments, createAppointment, updateAppointment, deleteAppointment,
} from "../../services/appointmentService";
import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";

function formatTimeLabel(value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const safeHours = Number.isFinite(hours) ? hours : 0;
  const safeMinutes = Number.isFinite(minutes) ? minutes : 0;
  const date = new Date();
  date.setHours(safeHours, safeMinutes, 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

const emptyForm = { patientId: "", doctorId: "", date: "", time: "", reason: "", status: "Pending" };

function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function AppointmentCalendar() {
  const [appointments, setAppointments] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("list");
  const [cursor, setCursor] = useState(new Date());
  const [filter, setFilter] = useState("All");

  function load() {
    getAppointments().then(setAppointments);
  }
  useEffect(() => {
    load();
    getPatients().then(setPatients);
    getDoctors().then(setDoctors);
  }, []);

  function openAdd(dateStr) {
    setEditing(null);
    setForm({ ...emptyForm, date: dateStr || "" });
    setModalOpen(true);
  }
  function openEdit(appt) {
    setEditing(appt);
    setForm(appt);
    setModalOpen(true);
  }
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const patient = patients.find((p) => p.id === form.patientId);
      const doctor = doctors.find((d) => d.id === form.doctorId);
      const payload = {
        ...form,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : form.patientName,
        doctorName: doctor ? doctor.name : form.doctorName,
      };
      if (editing) {
        await updateAppointment(editing.id, payload);
        window.alert("Appointment status updated successfully. Notifications have been sent.");
      } else {
        await createAppointment(payload);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }
  function handleDelete(id) {
    if (window.confirm("Cancel this appointment?")) deleteAppointment(id).then(load);
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const apptsByDate = useMemo(() => {
    const map = {};
    (appointments || []).forEach((a) => {
      if (filter !== "All" && a.status !== filter) return;
      map[a.date] = map[a.date] || [];
      map[a.date].push(a);
    });
    return map;
  }, [appointments, filter]);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (filter === "All") return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  return (
    <AppLayout>
      <Topbar
        title="Appointments"
        subtitle={`${appointments?.length ?? "…"} scheduled`}
        actions={
          <div className="flex-gap">
            <select className="inline-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
            <div className="view-toggle">
              <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
              <button className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}>Calendar</button>
            </div>
            <button className="btn btn-accent" onClick={() => openAdd()}>+ New appointment</button>
          </div>
        }
      />

      {!appointments ? (
        <Loader label="Loading appointments" />
      ) : view === "list" ? (
        filteredAppointments.length === 0 ? (
          <EmptyState title="No appointments" message="Schedule the first appointment to get started." />
        ) : (
          <div className="card table-wrap">
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filteredAppointments
                  .slice()
                  .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time))
                  .map((a) => (
                    <tr key={a.id}>
                      <td>{a.patientName}</td>
                      <td>{a.doctorName}</td>
                      <td className="mono">{a.date}</td>
                      <td className="mono">{formatTimeLabel(a.time)}</td>
                      <td>{a.reason}</td>
                      <td><span className={`badge ${a.status === "Confirmed" ? "badge-teal" : a.status === "Cancelled" ? "badge-coral" : "badge-amber"}`}>{a.status}</span></td>
                      <td>
                        <div className="flex-gap">
                          <button className="text-sm btn-link" onClick={() => openEdit(a)}>Edit</button>
                          <button className="btn-link-danger text-sm" onClick={() => handleDelete(a.id)}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="card card-pad">
          <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
            <button className="btn btn-outline btn-sm" onClick={() => setCursor(new Date(year, month - 1, 1))}>← Prev</button>
            <h3 className="mb-0">{monthLabel}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setCursor(new Date(year, month + 1, 1))}>Next →</button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="calendar-dow">{d}</div>
            ))}
            {cells.map((day, i) => {
              const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
              const dayAppts = dateStr ? apptsByDate[dateStr] || [] : [];
              return (
                <div
                  key={i}
                  className={`calendar-cell ${!day ? "empty" : ""}`}
                  onClick={() => day && openAdd(dateStr)}
                >
                  {day && <span className="calendar-day-num">{day}</span>}
                  {dayAppts.slice(0, 2).map((a) => (
                    <div key={a.id} className="calendar-chip" onClick={(e) => { e.stopPropagation(); openEdit(a); }}>
                      {formatTimeLabel(a.time)} {a.patientName.split(" ")[0]}
                    </div>
                  ))}
                  {dayAppts.length > 2 && <div className="calendar-more muted">+{dayAppts.length - 2} more</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit appointment" : "New appointment"}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Patient</label>
            <select name="patientId" value={form.patientId} onChange={handleChange} required>
              <option value="">— Select patient —</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Doctor</label>
            <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
              <option value="">— Select doctor —</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
            </select>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required />
              {form.time && <div className="field-hint">Selected time: {formatTimeLabel(form.time)}</div>}
            </div>
          </div>
          <div className="field">
            <label>Reason</label>
            <input name="reason" value={form.reason} onChange={handleChange} placeholder="Follow-up, consultation, etc." />
          </div>
          <div className="field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed (Approved)</option>
              <option value="Cancelled">Cancelled (Rejected)</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
          <div className="field">
            <label>Doctor's Remarks</label>
            <textarea name="remarks" value={form.remarks || ""} onChange={handleChange} rows={2} placeholder="Add remarks, comments or reschedule instructions" />
          </div>
          <div className="flex-gap" style={{ marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editing ? "Update appointment" : "Book appointment"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default AppointmentCalendar;

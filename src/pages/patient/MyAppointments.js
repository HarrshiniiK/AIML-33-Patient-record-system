import React, { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";

import { createAppointment, deleteAppointment, getAppointmentsForPatient, updateAppointment } from "../../services/appointmentService";
import { getDoctors } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";

function formatTimeLabel(value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const safeHours = Number.isFinite(hours) ? hours : 0;
  const safeMinutes = Number.isFinite(minutes) ? minutes : 0;
  const date = new Date();
  date.setHours(safeHours, safeMinutes, 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

const emptyForm = {
  doctorId: "",
  specialty: "",
  visitType: "Routine Checkup",
  date: "",
  time: "",
  reason: "",
  notes: "",
  preferredContact: "Phone",
};

function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ doctorId: "", date: "", time: "", reason: "", notes: "", visitType: "Routine Checkup" });
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleMessage, setRescheduleMessage] = useState("");

  const loadData = useCallback(() => {
    if (!user?.patientId) {
      setAppointments([]);
      setDoctors([]);
      return;
    }

    Promise.all([getAppointmentsForPatient(user.patientId), getDoctors()]).then(([patientAppointments, doctorList]) => {
      setAppointments(patientAppointments || []);
      setDoctors(doctorList || []);
    });
  }, [user?.patientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user?.patientId) return;

    setSaving(true);
    setMessage("");

    try {
      const doctor = doctors.find((item) => item.id === form.doctorId);
      await createAppointment({
        patientId: user.patientId,
        patientName: user.name,
        doctorId: form.doctorId,
        doctorName: doctor?.name || "",
        specialty: form.specialty || doctor?.specialization || "",
        visitType: form.visitType,
        date: form.date,
        time: form.time,
        reason: form.reason,
        notes: form.notes,
        preferredContact: form.preferredContact,
        status: "Pending",
      });
      setForm(emptyForm);
      setMessage("Appointment booked successfully.");
      loadData();
    } catch (err) {
      setMessage(err.message || "Unable to book appointment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    await deleteAppointment(id);
    loadData();
  }

  function openReschedule(appointment) {
    setReschedulingId(appointment.id);
    setRescheduleForm({
      doctorId: appointment.doctorId || "",
      date: appointment.date || "",
      time: appointment.time || "",
      reason: appointment.reason || "",
      notes: appointment.notes || "",
      visitType: appointment.visitType || "Routine Checkup",
    });
    setRescheduleMessage("");
  }

  function handleRescheduleChange(e) {
    setRescheduleForm({ ...rescheduleForm, [e.target.name]: e.target.value });
  }

  async function handleRescheduleSubmit(e) {
    e.preventDefault();
    if (!reschedulingId) return;

    setRescheduling(true);
    setRescheduleMessage("");

    try {
      const doctor = doctors.find((item) => item.id === rescheduleForm.doctorId);
      await updateAppointment(reschedulingId, {
        doctorId: rescheduleForm.doctorId,
        doctorName: doctor?.name || "",
        specialty: doctor?.specialization || "",
        visitType: rescheduleForm.visitType,
        date: rescheduleForm.date,
        time: rescheduleForm.time,
        reason: rescheduleForm.reason,
        notes: rescheduleForm.notes,
      });
      setReschedulingId(null);
      setRescheduleForm({ doctorId: "", date: "", time: "", reason: "", notes: "", visitType: "Routine Checkup" });
      setRescheduleMessage("Appointment rescheduled successfully.");
      loadData();
    } catch (err) {
      setRescheduleMessage(err.message || "Unable to reschedule appointment.");
    } finally {
      setRescheduling(false);
    }
  }

  if (!appointments) return <AppLayout><Loader label="Loading your appointments" /></AppLayout>;

  const now = new Date();
  const upcoming = appointments.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) >= now && appointment.status !== "Cancelled");
  const previous = appointments.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now || appointment.status === "Cancelled");
  const previousByDoctor = previous.reduce((groups, appointment) => {
    const label = appointment.doctorName || "Unassigned";
    if (!groups[label]) groups[label] = [];
    groups[label].push(appointment);
    return groups;
  }, {});

  return (
    <AppLayout>
      <Topbar
        title="My appointments"
        subtitle="Book, manage, and review your visits."
        actions={
          <button className="btn btn-accent" onClick={() => setShowForm((value) => !value)}>
            {showForm ? "Close form" : "Book new appointment"}
          </button>
        }
      />

      {showForm && (
        <div className="card card-pad" style={{ marginBottom: "var(--space-4)" }}>
          <h3 style={{ marginBottom: "var(--space-3)" }}>Book a new appointment</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Doctor</label>
              <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
                <option value="">— Select doctor —</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialization})</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Specialty</label>
                <input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Cardiology, Orthopedics..." />
              </div>
              <div className="field">
                <label>Visit type</label>
                <select name="visitType" value={form.visitType} onChange={handleChange}>
                  <option>Routine Checkup</option>
                  <option>Follow-up</option>
                  <option>Lab Review</option>
                  <option>Emergency</option>
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="field">
                <label>Time</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} required step="900" />
                {form.time && <div className="field-hint">Selected time: {formatTimeLabel(form.time)}</div>}
              </div>
            </div>
            <div className="field">
              <label>Reason</label>
              <input name="reason" value={form.reason} onChange={handleChange} placeholder="Follow-up, consultation, etc." required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Preferred contact</label>
                <select name="preferredContact" value={form.preferredContact} onChange={handleChange}>
                  <option>Phone</option>
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </div>
              <div className="field">
                <label>Additional notes</label>
                <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any symptoms or concerns" />
              </div>
            </div>
            {message && <div className={message.includes("success") ? "field-hint" : "field-error"} style={{ marginBottom: "var(--space-3)" }}>{message}</div>}
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Booking…" : "Book appointment"}</button>
          </form>
        </div>
      )}

      {reschedulingId && (
        <div className="card card-pad" style={{ marginBottom: "var(--space-4)" }}>
          <h3 style={{ marginBottom: "var(--space-3)" }}>Reschedule appointment</h3>
          <form onSubmit={handleRescheduleSubmit}>
            <div className="field">
              <label>Doctor</label>
              <select name="doctorId" value={rescheduleForm.doctorId} onChange={handleRescheduleChange} required>
                <option value="">— Select doctor —</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialization})</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Visit type</label>
                <select name="visitType" value={rescheduleForm.visitType} onChange={handleRescheduleChange}>
                  <option>Routine Checkup</option>
                  <option>Follow-up</option>
                  <option>Lab Review</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div className="field">
                <label>Reason</label>
                <input name="reason" value={rescheduleForm.reason} onChange={handleRescheduleChange} placeholder="Updated concern" required />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Date</label>
                <input type="date" name="date" value={rescheduleForm.date} onChange={handleRescheduleChange} required />
              </div>
              <div className="field">
                <label>Time</label>
                <input type="time" name="time" value={rescheduleForm.time} onChange={handleRescheduleChange} required step="900" />
              </div>
            </div>
            <div className="field">
              <label>Notes</label>
              <input name="notes" value={rescheduleForm.notes} onChange={handleRescheduleChange} placeholder="Any timing or preference notes" />
            </div>
            {rescheduleMessage && <div className={rescheduleMessage.includes("success") ? "field-hint" : "field-error"} style={{ marginBottom: "var(--space-3)" }}>{rescheduleMessage}</div>}
            <div className="flex-gap">
              <button type="submit" className="btn btn-primary" disabled={rescheduling}>{rescheduling ? "Updating…" : "Save changes"}</button>
              <button type="button" className="btn btn-outline" onClick={() => setReschedulingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card card-pad" style={{ marginBottom: "var(--space-4)" }}>
        <div className="section-header">
          <h3 className="mb-0">Upcoming appointments</h3>
          <span className="badge badge-teal">Next visits</span>
        </div>
        {upcoming.length === 0 ? (
          <p className="muted mb-0">No upcoming appointments yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {upcoming.map((a) => (
                  <tr key={a.id}>
                    <td>{a.doctorName}</td>
                    <td className="mono">{a.date}</td>
                    <td className="mono">{formatTimeLabel(a.time)}</td>
                    <td>{a.reason}</td>
                    <td><span className={`badge ${a.status === "Confirmed" ? "badge-teal" : "badge-amber"}`}>{a.status}</span></td>
                    <td>
                      <div className="flex-gap">
                        {a.status !== "Cancelled" && (
                          <>
                            <button className="btn-link text-sm" onClick={() => openReschedule(a)}>Reschedule</button>
                            <button className="btn-link-danger text-sm" onClick={() => handleCancel(a.id)}>Cancel</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card card-pad">
        <div className="section-header">
          <h3 className="mb-0">Previous appointments</h3>
          <span className="badge badge-slate">History</span>
        </div>
        {previous.length === 0 ? (
          <p className="muted mb-0">You don't have any previous appointments yet.</p>
        ) : (
          <div className="records-list">
            {Object.entries(previousByDoctor).map(([doctorName, doctorAppointments]) => (
              <div key={doctorName} className="card card-pad" style={{ marginBottom: "var(--space-3)" }}>
                <div className="section-header">
                  <h4 className="mb-0">{doctorName}</h4>
                  <span className="badge badge-slate">{doctorAppointments.length} visit{doctorAppointments.length > 1 ? "s" : ""}</span>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Visit type</th><th>Status</th><th>Notes</th></tr></thead>
                    <tbody>
                      {doctorAppointments.map((a) => (
                        <tr key={a.id}>
                          <td>{a.doctorName || doctorName}</td>
                          <td className="mono">{a.date}</td>
                          <td className="mono">{formatTimeLabel(a.time)}</td>
                          <td>{a.reason}</td>
                          <td>{a.visitType || "Routine Checkup"}</td>
                          <td><span className={`badge ${a.status === "Confirmed" ? "badge-teal" : a.status === "Cancelled" ? "badge-coral" : "badge-slate"}`}>{a.status}</span></td>
                          <td>{a.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default MyAppointments;

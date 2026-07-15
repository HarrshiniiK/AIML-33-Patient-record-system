import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";
import { getPatient, updatePatient } from "../../services/patientService";
import { getAppointmentsForPatient } from "../../services/appointmentService";
import { getRecordsForPatient } from "../../services/recordService";

const billingItems = [
  { id: "INV-1042", amount: "$84.00", status: "Paid", date: "2026-07-05" },
  { id: "INV-1043", amount: "$120.00", status: "Pending", date: "2026-07-20" },
];

const notificationItems = [
  { id: 1, title: "Appointment reminder", detail: "Your follow-up visit is booked for 10:00 AM tomorrow.", tone: "teal" },
  { id: 2, title: "Medication refill", detail: "Amlodipine refill is ready for pickup at the pharmacy.", tone: "amber" },
];

function PatientPortalPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [records, setRecords] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", dob: "", phone: "", address: "", emergencyContact: "" });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user?.patientId) {
      setProfile(null);
      setAppointments([]);
      setRecords([]);
      return;
    }

    Promise.all([
      getPatient(user.patientId),
      getAppointmentsForPatient(user.patientId),
      getRecordsForPatient(user.patientId),
    ]).then(([patient, allAppointments, allRecords]) => {
      setProfile(patient);
      setProfileForm({
        name: patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "",
        dob: patient?.dob || "",
        phone: patient?.phone || "",
        address: patient?.address || "",
        emergencyContact: patient?.emergencyContact || "",
      });
      setAppointments(allAppointments || []);
      setRecords(allRecords || []);
    });
  }, [user?.patientId]);

  if (user?.patientId && !profile && appointments === null) {
    return (
      <AppLayout>
        <Loader label="Loading your patient portal" />
      </AppLayout>
    );
  }

  const upcomingAppointments = (appointments || []).filter((appointment) => appointment.status !== "Cancelled");
  const recentRecords = (records || []).slice(0, 3);

  function handleProfileFieldChange(e) {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    if (!user?.patientId) return;

    const fullName = profileForm.name.trim().split(/\s+/);
    const firstName = fullName.shift() || "";
    const lastName = fullName.join(" ") || "";

    await updatePatient(user.patientId, {
      firstName,
      lastName,
      dob: profileForm.dob,
      phone: profileForm.phone,
      address: profileForm.address,
      emergencyContact: profileForm.emergencyContact,
    });

    const refreshed = await getPatient(user.patientId);
    setProfile(refreshed);
    setProfileForm({
      name: refreshed ? `${refreshed.firstName || ""} ${refreshed.lastName || ""}`.trim() : "",
      dob: refreshed?.dob || "",
      phone: refreshed?.phone || "",
      address: refreshed?.address || "",
      emergencyContact: refreshed?.emergencyContact || "",
    });
    setEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  return (
    <AppLayout>
      <Topbar
        title="Patient portal"
        subtitle="View your personal details, care history, appointments, billing, and reminders in one place."
      />

      <div className="portal-grid">
        <section className="card card-pad portal-section">
          <div className="section-header">
            <h3 className="mb-0">Profile</h3>
            <div className="flex-gap">
              {profileSaved && <span className="badge badge-teal">Saved</span>}
              <button className="btn btn-outline btn-sm" onClick={() => setEditingProfile((value) => !value)}>
                {editingProfile ? "Cancel" : "Update"}
              </button>
            </div>
          </div>
          {editingProfile ? (
            <form onSubmit={handleProfileSave}>
              <div className="field">
                <label>Full name</label>
                <input name="name" value={profileForm.name} onChange={handleProfileFieldChange} required />
              </div>
              <div className="field">
                <label>Date of birth</label>
                <input name="dob" type="date" value={profileForm.dob} onChange={handleProfileFieldChange} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input name="phone" value={profileForm.phone} onChange={handleProfileFieldChange} />
              </div>
              <div className="field">
                <label>Address</label>
                <input name="address" value={profileForm.address} onChange={handleProfileFieldChange} />
              </div>
              <div className="field">
                <label>Emergency contact</label>
                <input name="emergencyContact" value={profileForm.emergencyContact} onChange={handleProfileFieldChange} />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Save changes</button>
            </form>
          ) : (
            <div className="detail-list">
              <div>
                <dt>Full name</dt>
                <dd>{profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : user?.name}</dd>
              </div>
              <div>
                <dt>Date of birth</dt>
                <dd>{profile?.dob || "—"}</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>{profile?.phone || "—"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile?.email || user?.email || "—"}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{profile?.address || "—"}</dd>
              </div>
              <div>
                <dt>Emergency contact</dt>
                <dd>{profile?.emergencyContact || "—"}</dd>
              </div>
            </div>
          )}
        </section>

        <section className="card card-pad portal-section">
          <div className="section-header">
            <h3 className="mb-0">Medical history</h3>
            <Link to="/my-records" className="text-sm">View all →</Link>
          </div>
          {recentRecords.length === 0 ? (
            <p className="muted mb-0">No medical history has been added yet.</p>
          ) : (
            <ul className="portal-list">
              {recentRecords.map((record) => (
                <li key={record.id}>
                  <div className="portal-list-title">{record.title}</div>
                  <div className="muted text-sm">{record.type} · {record.date} · {record.doctor}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card card-pad portal-section">
          <div className="section-header">
            <h3 className="mb-0">Appointments</h3>
            <Link to="/my-appointments" className="text-sm">Manage →</Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="muted mb-0">No appointments scheduled right now.</p>
          ) : (
            <ul className="portal-list">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <li key={appointment.id}>
                  <div className="portal-list-title">{appointment.reason}</div>
                  <div className="muted text-sm">{appointment.doctorName} · {appointment.date} · {appointment.time}</div>
                </li>
              ))}
            </ul>
          )}
          <div className="portal-actions">
            <button className="btn btn-accent btn-sm">Book a visit</button>
            <button className="btn btn-outline btn-sm">Reschedule</button>
            <button className="btn btn-outline btn-sm">Cancel</button>
          </div>
        </section>

        <section className="card card-pad portal-section">
          <div className="section-header">
            <h3 className="mb-0">Billing</h3>
            <span className="badge badge-teal">Updated today</span>
          </div>
          <ul className="portal-list">
            {billingItems.map((item) => (
              <li key={item.id} className="billing-row">
                <div>
                  <div className="portal-list-title">{item.id}</div>
                  <div className="muted text-sm">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="portal-list-title">{item.amount}</div>
                  <div className={`badge ${item.status === "Paid" ? "badge-teal" : "badge-amber"}`}>{item.status}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card-pad portal-section portal-section-wide">
          <div className="section-header">
            <h3 className="mb-0">Notifications</h3>
            <span className="badge badge-slate">2 reminders</span>
          </div>
          <div className="notification-list">
            {notificationItems.map((item) => (
              <div key={item.id} className={`notification-item notification-${item.tone}`}>
                <strong>{item.title}</strong>
                <div className="muted text-sm">{item.detail}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default PatientPortalPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";
import { getPatient, updatePatient } from "../../services/patientService";
import { getAppointmentsForPatient } from "../../services/appointmentService";
import { getRecordsForPatient } from "../../services/recordService";
import { getNotifications } from "../../services/notificationService";

const billingItems = [
  { id: "INV-1042", amount: "$84.00", status: "Paid", date: "2026-07-05" },
  { id: "INV-1043", amount: "$120.00", status: "Pending", date: "2026-07-20" },
];



function PatientPortalPage() {
  const { user, updateUserSession } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [records, setRecords] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", dob: "", phone: "", address: "", bloodGroup: "", emergencyContact: "", assignedDoctor: "" });
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
      getNotifications(user.patientId, user.role)
    ]).then(([patient, allAppointments, allRecords, userNotifications]) => {
      setProfile(patient);
      setProfileForm({
        name: patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "",
        dob: patient?.dob || "",
        phone: patient?.phone || "",
        address: patient?.address || "",
        bloodGroup: patient?.bloodGroup || "O+",
        emergencyContact: patient?.emergencyContact || "",
        assignedDoctor: patient?.assignedDoctor || "Dr. Marcus Chen",
      });
      setAppointments(allAppointments || []);
      setRecords(allRecords || []);
      setNotifications(userNotifications || []);
    });
  }, [user]);

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
      bloodGroup: profileForm.bloodGroup || "O+",
      emergencyContact: profileForm.emergencyContact,
      assignedDoctor: profileForm.assignedDoctor || "Dr. Marcus Chen",
    });

    const refreshed = await getPatient(user.patientId);
    setProfile(refreshed);
    const newFullName = refreshed ? `${refreshed.firstName || ""} ${refreshed.lastName || ""}`.trim() : "";
    updateUserSession({ name: newFullName });
    setProfileForm({
      name: refreshed ? `${refreshed.firstName || ""} ${refreshed.lastName || ""}`.trim() : "",
      dob: refreshed?.dob || "",
      phone: refreshed?.phone || "",
      address: refreshed?.address || "",
      bloodGroup: refreshed?.bloodGroup || "O+",
      emergencyContact: refreshed?.emergencyContact || "",
      assignedDoctor: refreshed?.assignedDoctor || "Dr. Marcus Chen",
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
                <label>Blood group</label>
                <input name="bloodGroup" value={profileForm.bloodGroup} onChange={handleProfileFieldChange} placeholder="e.g. O+" />
              </div>
              <div className="field">
                <label>Emergency contact</label>
                <input name="emergencyContact" value={profileForm.emergencyContact} onChange={handleProfileFieldChange} />
              </div>
              <div className="field">
                <label>Assigned doctor</label>
                <input name="assignedDoctor" value={profileForm.assignedDoctor} onChange={handleProfileFieldChange} />
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
                <dt>Blood group</dt>
                <dd>{profile?.bloodGroup || "O+"}</dd>
              </div>
              <div>
                <dt>Emergency contact</dt>
                <dd>{profile?.emergencyContact || "—"}</dd>
              </div>
              <div>
                <dt>Assigned doctor</dt>
                <dd>{profile?.assignedDoctor || "Dr. Marcus Chen"}</dd>
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
            <span className="badge badge-slate">{notifications.filter(n => !n.read).length} unread</span>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="muted mb-0">No new notifications.</p>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className={`notification-item notification-${item.tone || "slate"}`}>
                  <strong>{item.title}</strong>
                  <div className="muted text-sm">{item.message}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default PatientPortalPage;

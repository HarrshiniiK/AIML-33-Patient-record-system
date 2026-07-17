import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../services/userService";
import { db } from "../../data/mockDb";
import { getPatient, updatePatient } from "../../services/patientService";

const profileDefaults = {
  age: "35",
  gender: "Male",
  phone: "9876543210",
  address: "12 Maple St, Riverton",
  emergencyContact: "Mina Osei · 9988776655",
};

function SettingsPage() {
  const { user, logout, updateUserSession } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState(profileDefaults.phone);
  const [address, setAddress] = useState(profileDefaults.address);
  const [emergencyContact, setEmergencyContact] = useState(profileDefaults.emergencyContact);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.patientId) return;

    getPatient(user.patientId).then((patient) => {
      if (!patient) return;
      const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
      setName(fullName || user.name);
      setDob(patient.dob || "");
      setPhone(patient.phone || profileDefaults.phone);
      setAddress(patient.address || profileDefaults.address);
      setEmergencyContact(patient.emergencyContact || profileDefaults.emergencyContact);
    });
  }, [user?.patientId, user?.name]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.patientId) return;

    const fullName = name.trim().split(/\s+/);
    const firstName = fullName.shift() || "";
    const lastName = fullName.join(" ") || "";

    await Promise.all([
      updateUser(user.id, { name }),
      updatePatient(user.patientId, { firstName, lastName, dob, phone, address, emergencyContact }),
    ]);

    const session = JSON.parse(localStorage.getItem("vitalis_session"));
    localStorage.setItem("vitalis_session", JSON.stringify({ ...session, name }));
    updateUserSession({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleResetDemoData() {
    if (window.confirm("Reset all demo data back to the original seed values? This affects everyone using this browser.")) {
      db.reset();
      window.location.reload();
    }
  }

  return (
    <AppLayout>
      <Topbar title="Settings" subtitle="Manage your profile and app data." />

      <div className="card card-pad" style={{ maxWidth: 640, marginBottom: "var(--space-5)" }}>
        <h3>Profile</h3>
        <form onSubmit={handleSave}>
          <div className="field">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Date of birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Emergency contact</label>
            <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled />
            <div className="field-hint">Email cannot be changed in this demo.</div>
          </div>
          <div className="field">
            <label>Role</label>
            <input value={user.role} disabled />
          </div>
          <div className="flex-gap">
            <button type="submit" className="btn btn-primary">Save changes</button>
            {saved && <span className="badge badge-teal">Saved</span>}
          </div>
        </form>
      </div>

      <div className="card card-pad" style={{ maxWidth: 480, marginBottom: "var(--space-5)" }}>
        <h3>Data</h3>
        <p className="muted">This project runs on mock data stored in your browser. Reset it any time.</p>
        <button className="btn btn-outline" onClick={handleResetDemoData}>Reset demo data</button>
      </div>

      <div className="card card-pad" style={{ maxWidth: 480 }}>
        <h3>Session</h3>
        <p className="muted">Sign out of your account on this device.</p>
        <button className="btn btn-danger" onClick={logout}>Log out</button>
      </div>
    </AppLayout>
  );
}

export default SettingsPage;

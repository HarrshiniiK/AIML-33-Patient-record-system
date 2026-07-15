import React, { useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../services/userService";
import { db } from "../../data/mockDb";

function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    await updateUser(user.id, { name });
    const session = JSON.parse(localStorage.getItem("vitalis_session"));
    localStorage.setItem("vitalis_session", JSON.stringify({ ...session, name }));
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

      <div className="card card-pad" style={{ maxWidth: 480, marginBottom: "var(--space-5)" }}>
        <h3>Profile</h3>
        <form onSubmit={handleSave}>
          <div className="field">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
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

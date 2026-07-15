import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { Modal } from "../../components/common/Modal";
import { getUsers, updateUser, deleteUser, createUser } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const ROLE_BADGE = { ADMIN: "badge-coral", DOCTOR: "badge-teal", STAFF: "badge-amber", PATIENT: "badge-slate" };
const emptyForm = { name: "", email: "", password: "", role: "STAFF" };

function UserManagement() {
  const [users, setUsers] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { user: currentUser } = useAuth();

  function load() {
    getUsers().then(setUsers);
  }
  useEffect(() => { load(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createUser(form);
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } finally {
      setSaving(false);
    }
  }
  function handleRoleChange(id, role) {
    updateUser(id, { role }).then(load);
  }
  function handleDelete(id, name) {
    if (id === currentUser.id) {
      window.alert("You can't remove your own account while logged in.");
      return;
    }
    if (window.confirm(`Remove ${name}'s account?`)) deleteUser(id).then(load);
  }

  return (
    <AppLayout>
      <Topbar
        title="User management"
        subtitle={`${users?.length ?? "…"} accounts across all roles`}
        actions={<button className="btn btn-accent" onClick={() => setModalOpen(true)}>+ Add user</button>}
      />

      {!users ? (
        <Loader label="Loading users" />
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="inline-select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="DOCTOR">DOCTOR</option>
                      <option value="STAFF">STAFF</option>
                      <option value="PATIENT">PATIENT</option>
                    </select>
                    <span className={`badge ${ROLE_BADGE[u.role]}`} style={{ marginLeft: 8 }}>{u.role}</span>
                  </td>
                  <td>
                    <button className="btn-link-danger text-sm" onClick={() => handleDelete(u.id, u.name)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add user">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Temporary password</label>
            <input type="text" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Doctor</option>
              <option value="STAFF">Staff</option>
              <option value="PATIENT">Patient</option>
            </select>
          </div>
          <div className="flex-gap" style={{ marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Adding…" : "Add user"}</button>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default UserManagement;

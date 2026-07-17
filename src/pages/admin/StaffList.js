import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { Modal, EmptyState } from "../../components/common/Modal";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const emptyStaff = { name: "", email: "", password: "", phone: "", role: "STAFF" };

function StaffList() {
  const [users, setUsers] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyStaff);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user: currentUser } = useAuth();

  const itemsPerPage = 10;

  function load() {
    getUsers().then(setUsers);
  }

  useEffect(() => {
    load();
  }, []);

  const filteredStaff = (users || []).filter((u) => {
    if (u.role !== "STAFF") return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function openAdd() {
    setEditing(null);
    setForm(emptyStaff);
    setModalOpen(true);
  }

  function openEdit(staff) {
    setEditing(staff);
    setForm({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      password: "",
      role: "STAFF",
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: "STAFF",
        };
        await updateUser(editing.id, payload);
      } else {
        await createUser(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      window.alert(err.message || "An error occurred while saving staff details.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id, name) {
    if (id === currentUser.id) {
      window.alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm(`Remove ${name} from the staff roster?`)) {
      deleteUser(id).then(load);
    }
  }

  function handleClear() {
    setQuery("");
    setCurrentPage(1);
  }

  return (
    <AppLayout>
      <Topbar
        title="Staff Management"
        subtitle={`${filteredStaff.length} staff records on file`}
        actions={<button className="btn btn-accent" onClick={openAdd}>+ Add staff</button>}
      />

      <form onSubmit={(e) => e.preventDefault()} className="flex-gap" style={{ marginBottom: "var(--space-5)" }}>
        <input
          className="search-input"
          placeholder="Search by name, email or phone…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        {query && <button type="button" className="btn btn-outline" onClick={handleClear}>Clear</button>}
      </form>

      {!users ? (
        <Loader label="Loading staff records" />
      ) : filteredStaff.length === 0 ? (
        <EmptyState title="No staff members found" message="Try searching for another record, or register a new staff member." />
      ) : (
        <>
          <div className="card table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.email}</td>
                    <td className="mono">{s.phone || "—"}</td>
                    <td><span className="badge badge-amber">{s.role}</span></td>
                    <td>
                      <div className="flex-gap">
                        <button className="text-sm btn-link" onClick={() => openEdit(s)}>Edit</button>
                        <button className="btn-link-danger text-sm" onClick={() => handleDelete(s.id, s.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex-between" style={{ marginTop: "var(--space-4)" }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ← Previous
              </button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Staff Details" : "Register New Staff"}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Jane Smith" />
          </div>
          <div className="field">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="janesmith@hospital.com" />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="555-0199" />
          </div>
          {!editing && (
            <div className="field">
              <label>Temporary Password</label>
              <input type="text" name="password" value={form.password} onChange={handleChange} required placeholder="Enter temporary password" />
            </div>
          )}
          <div className="flex-gap" style={{ marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editing ? "Update Staff" : "Add Staff"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default StaffList;

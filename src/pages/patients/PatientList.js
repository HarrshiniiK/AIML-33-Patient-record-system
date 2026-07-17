import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { EmptyState } from "../../components/common/Modal";
import { getPatients, deletePatient, searchPatients } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

const STATUS_BADGE = {
  Admitted: "badge-coral",
  Outpatient: "badge-teal",
  Discharged: "badge-slate",
};

function PatientList() {
  const [patients, setPatients] = useState(null);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const canEdit = ["ADMIN", "STAFF"].includes(user.role);
  const isDoctor = user.role === "DOCTOR";

  function scopeToRole(list) {
    return isDoctor ? list.filter((p) => p.assignedDoctor === user.name) : list;
  }

  function load() {
    getPatients().then((all) => setPatients(scopeToRole(all)));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return load();
    searchPatients(query).then((results) => setPatients(scopeToRole(results)));
  }

  function handleDelete(id, name) {
    if (window.confirm(`Delete the record for ${name}? This cannot be undone.`)) {
      deletePatient(id).then(load);
    }
  }

  return (
    <AppLayout>
      <Topbar
        title="Patients"
        subtitle={isDoctor ? `${patients?.length ?? "…"} patients assigned to you` : `${patients?.length ?? "…"} records on file`}
        actions={user.role !== "ADMIN" && canEdit && <Link to="/patients/add" className="btn btn-accent">+ Add patient</Link>}
      />

      <form onSubmit={handleSearch} className="flex-gap" style={{ marginBottom: "var(--space-5)" }}>
        <input
          className="search-input"
          placeholder="Search by name or diagnosis…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-outline">Search</button>
        {query && <button type="button" className="btn btn-outline" onClick={() => { setQuery(""); load(); }}>Clear</button>}
      </form>

      {!patients ? (
        <Loader label="Loading patients" />
      ) : patients.length === 0 ? (
        <EmptyState title="No patients found" message="Try a different search, or add a new patient record." />
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Gender</th><th>Blood group</th><th>Diagnosis</th><th>Status</th><th>Doctor</th><th></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/patients/${p.id}`}>{p.firstName} {p.lastName}</Link></td>
                  <td>{p.gender}</td>
                  <td className="mono">{p.bloodGroup || "—"}</td>
                  <td>{p.disease || "—"}</td>
                  <td><span className={`badge ${STATUS_BADGE[p.status] || "badge-slate"}`}>{p.status || "—"}</span></td>
                  <td>{p.assignedDoctor || "—"}</td>
                  <td>
                    <div className="flex-gap">
                      <Link to={`/patients/${p.id}`} className="text-sm">View</Link>
                      {canEdit && (
                        <>
                          <Link to={`/patients/edit/${p.id}`} className="text-sm">Edit</Link>
                          <button className="btn-link-danger text-sm" onClick={() => handleDelete(p.id, `${p.firstName} ${p.lastName}`)}>Delete</button>
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
    </AppLayout>
  );
}

export default PatientList;

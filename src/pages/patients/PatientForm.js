import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import { getPatient, createPatient, updatePatient } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";

const initialState = {
  firstName: "", lastName: "", dob: "", gender: "Male", phone: "", email: "",
  address: "", bloodGroup: "", disease: "", admittedDate: "", status: "Outpatient", assignedDoctor: "",
};

function PatientForm() {
  const [patient, setPatient] = useState(initialState);
  const [doctors, setDoctors] = useState([]);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    getDoctors().then(setDoctors);
    if (isEdit) getPatient(id).then((data) => data && setPatient(data));
  }, [id, isEdit]);

  function handleChange(e) {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await updatePatient(id, patient);
      else await createPatient(patient);
      navigate("/patients");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <Topbar title={isEdit ? "Edit patient" : "Add new patient"} subtitle="Fill in the record details below." />
      <div className="card card-pad" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>First name</label>
              <input name="firstName" value={patient.firstName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Last name</label>
              <input name="lastName" value={patient.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Date of birth</label>
              <input type="date" name="dob" value={patient.dob || ""} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Gender</label>
              <select name="gender" value={patient.gender} onChange={handleChange}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Phone</label>
              <input name="phone" value={patient.phone} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" value={patient.email} onChange={handleChange} />
            </div>
          </div>

          <div className="field">
            <label>Address</label>
            <input name="address" value={patient.address} onChange={handleChange} />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Blood group</label>
              <input name="bloodGroup" value={patient.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
            </div>
            <div className="field">
              <label>Status</label>
              <select name="status" value={patient.status} onChange={handleChange}>
                <option>Outpatient</option><option>Admitted</option><option>Discharged</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Diagnosis</label>
            <input name="disease" value={patient.disease} onChange={handleChange} placeholder="Primary diagnosis" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Admitted date</label>
              <input type="date" name="admittedDate" value={patient.admittedDate || ""} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Assigned doctor</label>
              <select name="assignedDoctor" value={patient.assignedDoctor} onChange={handleChange}>
                <option value="">— Select —</option>
                {doctors.map((d) => <option key={d.id} value={d.name}>{d.name} ({d.specialization})</option>)}
              </select>
            </div>
          </div>

          <div className="flex-gap" style={{ marginTop: "var(--space-5)" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Update patient" : "Save patient"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/patients")}>Cancel</button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default PatientForm;

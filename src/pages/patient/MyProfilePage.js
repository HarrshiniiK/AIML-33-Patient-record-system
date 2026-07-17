import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";
import { getPatient, updatePatient } from "../../services/patientService";

function MyProfilePage() {
  const { user, updateUserSession } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    assignedDoctor: "",
    disease: "",
    status: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user?.patientId) return;
    getPatient(user.patientId).then((data) => {
      setPatient(data);
      setForm({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        dob: data?.dob || "",
        phone: data?.phone || "",
        address: data?.address || "",
        bloodGroup: data?.bloodGroup || "O+",
        emergencyContact: data?.emergencyContact || "",
        assignedDoctor: data?.assignedDoctor || "Dr. Marcus Chen",
        disease: data?.disease || "",
        status: data?.status || "Outpatient",
      });
    });
  }, [user?.patientId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user?.patientId) return;

    setSaving(true);
    setMessage("");

    try {
      await updatePatient(user.patientId, {
        firstName: form.firstName,
        lastName: form.lastName,
        dob: form.dob,
        phone: form.phone,
        address: form.address,
        bloodGroup: form.bloodGroup,
        emergencyContact: form.emergencyContact,
        assignedDoctor: form.assignedDoctor,
        disease: form.disease,
        status: form.status,
      });
      const refreshed = await getPatient(user.patientId);
      setPatient(refreshed);
      const newFullName = `${refreshed.firstName || ""} ${refreshed.lastName || ""}`.trim();
      updateUserSession({ name: newFullName });
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setMessage(error.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (!patient) return <AppLayout><Loader label="Loading your profile" /></AppLayout>;

  return (
    <AppLayout>
      <Topbar title="My profile" subtitle="View and edit your patient details" />
      <div className="card card-pad" style={{ maxWidth: "860px" }}>
        <div className="section-header">
          <h3 className="mb-0">Patient details</h3>
          <div className="flex-gap">
            <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit profile"}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>First name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="field">
                <label>Last name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Date of birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Blood group</label>
                <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Emergency contact</label>
                <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Assigned doctor</label>
                <input name="assignedDoctor" value={form.assignedDoctor} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Status</label>
                <input name="status" value={form.status} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label>Diagnosis / concern</label>
              <input name="disease" value={form.disease} onChange={handleChange} />
            </div>

            {message && <div className={message.includes("success") ? "field-hint" : "field-error"} style={{ marginBottom: "var(--space-3)" }}>{message}</div>}

            <div className="flex-gap">
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="detail-list">
            <div>
              <dt>First name</dt>
              <dd>{patient.firstName || "—"}</dd>
            </div>
            <div>
              <dt>Last name</dt>
              <dd>{patient.lastName || "—"}</dd>
            </div>
            <div>
              <dt>Date of birth</dt>
              <dd>{patient.dob || "—"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{patient.phone || "—"}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{patient.address || "—"}</dd>
            </div>
            <div>
              <dt>Blood group</dt>
              <dd>{patient.bloodGroup || "—"}</dd>
            </div>
            <div>
              <dt>Emergency contact</dt>
              <dd>{patient.emergencyContact || "—"}</dd>
            </div>
            <div>
              <dt>Assigned doctor</dt>
              <dd>{patient.assignedDoctor || "—"}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{patient.status || "—"}</dd>
            </div>
            <div>
              <dt>Diagnosis / concern</dt>
              <dd>{patient.disease || "—"}</dd>
            </div>
            {message && <div className={message.includes("success") ? "field-hint" : "field-error"} style={{ marginTop: "var(--space-3)" }}>{message}</div>}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default MyProfilePage;

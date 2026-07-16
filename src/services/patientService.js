import { db } from "../data/mockDb";

function withPatientDefaults(patient) {
  if (!patient) return null;

  const normalized = {
    ...patient,
    bloodGroup: patient.bloodGroup || "O+",
    assignedDoctor: patient.assignedDoctor || "Dr. Marcus Chen",
  };

  if (patient.id === "p1") {
    return {
      ...normalized,
      firstName: "Harsh",
      lastName: "Patel",
      dob: normalized.dob || "1992-03-08",
      gender: normalized.gender || "Male",
      phone: normalized.phone || "9876543210",
      email: normalized.email || "harsh@gmail.com",
      address: normalized.address || "12 Maple St, Riverton",
      bloodGroup: normalized.bloodGroup || "O+",
      disease: normalized.disease || "Hypertension",
      status: normalized.status || "Outpatient",
      assignedDoctor: normalized.assignedDoctor || "Dr. Marcus Chen",
    };
  }

  return normalized;
}

export async function getPatients() {
  const patients = await db.list("patients");
  return patients.map(withPatientDefaults);
}

export async function getPatient(id) {
  const patient = await db.get("patients", id);
  const normalized = withPatientDefaults(patient);

  if (id === "p1" && normalized) {
    await db.update("patients", id, {
      firstName: "Harsh",
      lastName: "Patel",
      dob: normalized.dob || "1992-03-08",
      gender: normalized.gender || "Male",
      phone: normalized.phone || "9876543210",
      email: normalized.email || "harsh@gmail.com",
      address: normalized.address || "12 Maple St, Riverton",
      bloodGroup: normalized.bloodGroup || "O+",
      disease: normalized.disease || "Hypertension",
      status: normalized.status || "Outpatient",
      assignedDoctor: normalized.assignedDoctor || "Dr. Marcus Chen",
    });
  }

  return normalized;
}

export const createPatient = (data) =>
  db.create("patients", { status: "Outpatient", bloodGroup: "O+", assignedDoctor: "Dr. Marcus Chen", ...data }, "p");
export const updatePatient = (id, data) => db.update("patients", id, data);
export const deletePatient = (id) => db.remove("patients", id);

export async function searchPatients(query) {
  const all = await db.list("patients");
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter(
    (p) =>
      p.firstName?.toLowerCase().includes(q) ||
      p.lastName?.toLowerCase().includes(q) ||
      p.disease?.toLowerCase().includes(q)
  );
}

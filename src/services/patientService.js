import { db } from "../data/mockDb";

export const getPatients = () => db.list("patients");
export const getPatient = (id) => db.get("patients", id);
export const createPatient = (data) => db.create("patients", { status: "Outpatient", ...data }, "p");
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

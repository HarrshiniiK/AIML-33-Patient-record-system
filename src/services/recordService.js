import { db } from "../data/mockDb";

export const getRecords = () => db.list("records");
export const createRecord = (data) => db.create("records", data, "r");
export const updateRecord = (id, data) => db.update("records", id, data);
export const deleteRecord = (id) => db.remove("records", id);

export async function getRecordsForPatient(patientId) {
  const all = await db.list("records");
  return all.filter((r) => r.patientId === patientId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

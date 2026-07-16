import { db } from "../data/mockDb";

export async function getPrescriptions(patientId) {
  const prescriptions = await db.list("prescriptions");
  if (!patientId) return prescriptions;
  return prescriptions.filter((item) => item.patientId === patientId);
}

export async function createRefillRequest(request) {
  return db.create("refillRequests", request, "rr");
}

export async function getRefillRequests() {
  return db.list("refillRequests");
}

export async function updateRefillRequest(id, updates) {
  return db.update("refillRequests", id, updates);
}

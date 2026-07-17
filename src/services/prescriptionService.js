import api from "./api";

export async function getPrescriptions(patientId) {
  return api.get("/prescriptions", { params: { patientId } }).then((res) => res.data);
}

export async function createRefillRequest(request) {
  return api.post("/prescriptions/refills", request).then((res) => res.data);
}

export async function getRefillRequests(patientId) {
  return api.get("/prescriptions/refills", { params: { patientId } }).then((res) => res.data);
}

export async function updateRefillRequest(id, updates) {
  return api.put(`/prescriptions/refills/${id}`, updates).then((res) => res.data);
}

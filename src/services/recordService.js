import api from "./api";

export const getRecords = () => api.get("/records").then((res) => res.data);
export const createRecord = (data) => api.post("/records", data).then((res) => res.data);
export const updateRecord = (id, data) => api.put(`/records/${id}`, data).then((res) => res.data);
export const deleteRecord = (id) => api.delete(`/records/${id}`).then((res) => res.data);
export const getRecordsForPatient = (patientId) => api.get(`/records/patient/${patientId}`).then((res) => res.data);

import api from "./api";

export const getAppointments = () => api.get("/appointments").then((res) => res.data);
export const getAppointment = (id) => api.get(`/appointments/${id}`).then((res) => res.data);
export const createAppointment = (data) => api.post("/appointments", data).then((res) => res.data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data).then((res) => res.data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`).then((res) => res.data);
export const getAppointmentsForPatient = (patientId) => api.get(`/appointments/patient/${patientId}`).then((res) => res.data);

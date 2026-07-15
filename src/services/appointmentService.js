import { db } from "../data/mockDb";

export const getAppointments = () => db.list("appointments");
export const getAppointment = (id) => db.get("appointments", id);
export const createAppointment = (data) => db.create("appointments", { status: "Pending", ...data }, "a");
export const updateAppointment = (id, data) => db.update("appointments", id, data);
export const deleteAppointment = (id) => db.remove("appointments", id);

export async function getAppointmentsForPatient(patientId) {
  const all = await db.list("appointments");
  return all.filter((a) => a.patientId === patientId);
}

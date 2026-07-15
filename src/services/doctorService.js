import { db } from "../data/mockDb";

export const getDoctors = () => db.list("doctors");
export const getDoctor = (id) => db.get("doctors", id);
export const createDoctor = (data) => db.create("doctors", data, "d");
export const updateDoctor = (id, data) => db.update("doctors", id, data);
export const deleteDoctor = (id) => db.remove("doctors", id);

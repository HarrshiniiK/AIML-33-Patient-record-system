import { db } from "../data/mockDb";

export async function login(email, password) {
  const users = await db.list("users");
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

export async function register({ name, email, password }) {
  const users = await db.list("users");
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }
  const patient = await db.create(
    "patients",
    { firstName: name.split(" ")[0], lastName: name.split(" ").slice(1).join(" ") || "—", status: "Outpatient" },
    "p"
  );
  const newUser = await db.create("users", { name, email, password, role: "PATIENT", patientId: patient.id }, "u");
  const { password: _pw, ...safeUser } = newUser;
  return safeUser;
}

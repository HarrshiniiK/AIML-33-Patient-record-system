import { db } from "../data/mockDb";

export async function getUsers() {
  const users = await db.list("users");
  return users.map(({ password, ...rest }) => rest);
}
export const updateUser = (id, data) => db.update("users", id, data);
export const deleteUser = (id) => db.remove("users", id);
export const createUser = (data) => db.create("users", data, "u");

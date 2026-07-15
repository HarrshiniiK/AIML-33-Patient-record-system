// A tiny mock "database" backed by localStorage, so the app is fully
// functional without a real backend. Every function returns a Promise
// and adds a small artificial delay, so swapping this out for real
// axios calls later (see /src/services) is a drop-in replacement.

import { seedUsers, seedPatients, seedDoctors, seedAppointments, seedRecords } from "./seedData";

const KEYS = {
  users: "vitalis_users",
  patients: "vitalis_patients",
  doctors: "vitalis_doctors",
  appointments: "vitalis_appointments",
  records: "vitalis_records",
};

function seedIfEmpty() {
  if (!localStorage.getItem(KEYS.users)) localStorage.setItem(KEYS.users, JSON.stringify(seedUsers));
  if (!localStorage.getItem(KEYS.patients)) localStorage.setItem(KEYS.patients, JSON.stringify(seedPatients));
  if (!localStorage.getItem(KEYS.doctors)) localStorage.setItem(KEYS.doctors, JSON.stringify(seedDoctors));
  if (!localStorage.getItem(KEYS.appointments)) localStorage.setItem(KEYS.appointments, JSON.stringify(seedAppointments));
  if (!localStorage.getItem(KEYS.records)) localStorage.setItem(KEYS.records, JSON.stringify(seedRecords));
}
seedIfEmpty();

function read(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function uid(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export const db = {
  async list(key) {
    await delay();
    return read(KEYS[key]);
  },
  async get(key, id) {
    await delay(150);
    return read(KEYS[key]).find((item) => item.id === id) || null;
  },
  async create(key, data, prefix) {
    await delay();
    const items = read(KEYS[key]);
    const newItem = { id: uid(prefix), ...data };
    items.push(newItem);
    write(KEYS[key], items);
    return newItem;
  },
  async update(key, id, data) {
    await delay();
    const items = read(KEYS[key]);
    const idx = items.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Record not found");
    items[idx] = { ...items[idx], ...data };
    write(KEYS[key], items);
    return items[idx];
  },
  async remove(key, id) {
    await delay();
    const items = read(KEYS[key]).filter((item) => item.id !== id);
    write(KEYS[key], items);
    return true;
  },
  KEYS,
  reset() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    seedIfEmpty();
  },
};

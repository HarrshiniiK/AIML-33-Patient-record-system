// A tiny mock "database" backed by localStorage, so the app is fully
// functional without a real backend. Every function returns a Promise
// and adds a small artificial delay, so swapping this out for real
// axios calls later (see /src/services) is a drop-in replacement.

import { seedUsers, seedPatients, seedDoctors, seedAppointments, seedRecords } from "./seedData";

const seedPrescriptions = [
  {
    id: "rx1",
    patientId: "p1",
    name: "Amlodipine",
    dosage: "5mg",
    duration: "Daily for 30 days",
    notes: "Take with food. Monitor blood pressure regularly.",
    status: "Active",
  },
  {
    id: "rx2",
    patientId: "p1",
    name: "Atorvastatin",
    dosage: "20mg",
    duration: "Every evening for 14 days",
    notes: "Doctor's note: continue until follow-up review.",
    status: "Active",
  },
  {
    id: "rx3",
    patientId: "p1",
    name: "Metoprolol",
    dosage: "50mg",
    duration: "Twice daily for 21 days",
    notes: "Take as prescribed; avoid skipping doses.",
    status: "Active",
  },
  {
    id: "rx4",
    patientId: "p1",
    name: "Hydrochlorothiazide",
    dosage: "12.5mg",
    duration: "Once daily in the morning",
    notes: "Monitor hydration and blood pressure.",
    status: "Active",
  },
  {
    id: "rx5",
    patientId: "p1",
    name: "Omeprazole",
    dosage: "20mg",
    duration: "Before breakfast for 14 days",
    notes: "Use for reflux symptoms only as directed.",
    status: "Active",
  },
  {
    id: "rx6",
    patientId: "p1",
    name: "Vitamin D3",
    dosage: "1000 IU",
    duration: "Once daily",
    notes: "Take with a meal.",
    status: "Active",
  },
  {
    id: "rx7",
    patientId: "p1",
    name: "Lisinopril",
    dosage: "10mg",
    duration: "Once daily",
    notes: "Report dizziness or persistent cough.",
    status: "Active",
  },
  {
    id: "rx8",
    patientId: "p1",
    name: "Acetaminophen",
    dosage: "650mg",
    duration: "Every 6 hours as needed",
    notes: "Do not exceed recommended dose.",
    status: "Active",
  },
  {
    id: "rx9",
    patientId: "p1",
    name: "Sertraline",
    dosage: "50mg",
    duration: "Once daily in the evening",
    notes: "Continue therapy and report mood changes.",
    status: "Active",
  },
  {
    id: "rx10",
    patientId: "p1",
    name: "Albuterol Inhaler",
    dosage: "2 puffs",
    duration: "As needed for shortness of breath",
    notes: "Keep inhaler accessible and rinse mouth after use.",
    status: "Active",
  },
];

const seedRefillRequests = [];

const KEYS = {
  users: "vitalis_users",
  patients: "vitalis_patients",
  doctors: "vitalis_doctors",
  appointments: "vitalis_appointments",
  records: "vitalis_records",
  prescriptions: "vitalis_prescriptions",
  refillRequests: "vitalis_refill_requests",
};

function mergeSeedData(existingItems, seedItems) {
  const merged = [...(existingItems || [])];
  const existingById = new Map(merged.map((item) => [item.id, item]));

  seedItems.forEach((seedItem) => {
    const existingItem = existingById.get(seedItem.id);
    if (!existingItem) {
      merged.push(seedItem);
      existingById.set(seedItem.id, seedItem);
      return;
    }

    const mergedItem = { ...existingItem };
    Object.entries(seedItem).forEach(([key, value]) => {
      if (mergedItem[key] === undefined || mergedItem[key] === null || mergedItem[key] === "") {
        mergedItem[key] = value;
      }
    });

    const index = merged.findIndex((item) => item.id === seedItem.id);
    merged[index] = mergedItem;
    existingById.set(seedItem.id, mergedItem);
  });

  return merged;
}

function seedIfEmpty() {
  const users = JSON.parse(localStorage.getItem(KEYS.users) || "null");
  const patients = JSON.parse(localStorage.getItem(KEYS.patients) || "null");
  const doctors = JSON.parse(localStorage.getItem(KEYS.doctors) || "null");
  const appointments = JSON.parse(localStorage.getItem(KEYS.appointments) || "null");
  const records = JSON.parse(localStorage.getItem(KEYS.records) || "null");
  const prescriptions = JSON.parse(localStorage.getItem(KEYS.prescriptions) || "null");
  const refillRequests = JSON.parse(localStorage.getItem(KEYS.refillRequests) || "null");

  if (!users) localStorage.setItem(KEYS.users, JSON.stringify(seedUsers));
  else localStorage.setItem(KEYS.users, JSON.stringify(mergeSeedData(users, seedUsers)));

  if (!patients) localStorage.setItem(KEYS.patients, JSON.stringify(seedPatients));
  else localStorage.setItem(KEYS.patients, JSON.stringify(mergeSeedData(patients, seedPatients)));

  if (!doctors) localStorage.setItem(KEYS.doctors, JSON.stringify(seedDoctors));
  else localStorage.setItem(KEYS.doctors, JSON.stringify(mergeSeedData(doctors, seedDoctors)));

  if (!appointments) localStorage.setItem(KEYS.appointments, JSON.stringify(seedAppointments));
  else localStorage.setItem(KEYS.appointments, JSON.stringify(mergeSeedData(appointments, seedAppointments)));

  if (!records) localStorage.setItem(KEYS.records, JSON.stringify(seedRecords));
  else localStorage.setItem(KEYS.records, JSON.stringify(mergeSeedData(records, seedRecords)));

  if (!prescriptions) localStorage.setItem(KEYS.prescriptions, JSON.stringify(seedPrescriptions));
  else localStorage.setItem(KEYS.prescriptions, JSON.stringify(mergeSeedData(prescriptions, seedPrescriptions)));

  if (!refillRequests) localStorage.setItem(KEYS.refillRequests, JSON.stringify(seedRefillRequests));
  else localStorage.setItem(KEYS.refillRequests, JSON.stringify(mergeSeedData(refillRequests, seedRefillRequests)));
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

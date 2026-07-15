// Seed data used to initialize the mock "database" (localStorage) on first run.

export const seedUsers = [
  { id: "u1", name: "Ava Whitfield", email: "admin@vitalis.dev", password: "admin123", role: "ADMIN" },
  { id: "u2", name: "Dr. Marcus Chen", email: "doctor@vitalis.dev", password: "doctor123", role: "DOCTOR", specialization: "Cardiology" },
  { id: "u3", name: "Priya Nair", email: "staff@vitalis.dev", password: "staff123", role: "STAFF" },
  { id: "u4", name: "Daniel Osei", email: "patient@vitalis.dev", password: "patient123", role: "PATIENT", patientId: "p1" },
];

export const seedPatients = [
  { id: "p1", firstName: "Daniel", lastName: "Osei", dob: "1990-05-14", gender: "Male", phone: "9876543210", email: "daniel.osei@mail.com", address: "12 Maple St, Riverton", bloodGroup: "O+", disease: "Hypertension", admittedDate: "2026-06-01", status: "Admitted", assignedDoctor: "Dr. Marcus Chen" },
  { id: "p2", firstName: "Jane", lastName: "Smith", dob: "1985-11-02", gender: "Female", phone: "9876500000", email: "jane.smith@mail.com", address: "456 Park Ave, Riverton", bloodGroup: "A+", disease: "Type 2 Diabetes", admittedDate: "2026-06-15", status: "Outpatient", assignedDoctor: "Dr. Marcus Chen" },
  { id: "p3", firstName: "Leo", lastName: "Martins", dob: "1978-02-20", gender: "Male", phone: "9812345678", email: "leo.martins@mail.com", address: "9 Birch Lane, Fairview", bloodGroup: "B-", disease: "Fractured Tibia", admittedDate: "2026-05-28", status: "Discharged", assignedDoctor: "Dr. Marcus Chen" },
  { id: "p4", firstName: "Amara", lastName: "Diallo", dob: "1999-09-09", gender: "Female", phone: "9800112233", email: "amara.d@mail.com", address: "77 Lake Rd, Fairview", bloodGroup: "AB+", disease: "Asthma", admittedDate: "2026-06-20", status: "Outpatient", assignedDoctor: "Dr. Marcus Chen" },
  { id: "p5", firstName: "Noah", lastName: "Becker", dob: "1965-07-30", gender: "Male", phone: "9845098450", email: "noah.b@mail.com", address: "3 Cedar Ct, Riverton", bloodGroup: "O-", disease: "Coronary Artery Disease", admittedDate: "2026-06-25", status: "Admitted", assignedDoctor: "Dr. Marcus Chen" },
];

export const seedDoctors = [
  { id: "d1", name: "Dr. Marcus Chen", specialization: "Cardiology", phone: "9911223344", email: "doctor@vitalis.dev", experience: 12, availability: "Mon-Fri, 9AM-4PM" },
  { id: "d2", name: "Dr. Elena Vargas", specialization: "Orthopedics", phone: "9911223355", email: "elena.vargas@vitalis.dev", experience: 8, availability: "Tue-Sat, 10AM-5PM" },
  { id: "d3", name: "Dr. Samuel Okafor", specialization: "Pediatrics", phone: "9911223366", email: "samuel.okafor@vitalis.dev", experience: 15, availability: "Mon-Thu, 8AM-2PM" },
];

export const seedAppointments = [
  { id: "a1", patientId: "p1", patientName: "Daniel Osei", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2026-07-10", time: "10:00", reason: "Follow-up consultation", status: "Confirmed" },
  { id: "a2", patientId: "p2", patientName: "Jane Smith", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2026-07-11", time: "14:30", reason: "Blood sugar review", status: "Pending" },
  { id: "a3", patientId: "p4", patientName: "Amara Diallo", doctorId: "d2", doctorName: "Dr. Elena Vargas", date: "2026-07-09", time: "11:00", reason: "Asthma check-up", status: "Confirmed" },
  { id: "a4", patientId: "p5", patientName: "Noah Becker", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2026-07-14", time: "09:30", reason: "Cardiac review", status: "Confirmed" },
];

export const seedRecords = [
  { id: "r1", patientId: "p1", date: "2026-06-01", type: "Prescription", title: "Amlodipine 5mg", notes: "Once daily for blood pressure management. Review in 4 weeks.", doctor: "Dr. Marcus Chen" },
  { id: "r2", patientId: "p1", date: "2026-06-15", type: "Lab Report", title: "Lipid Panel", notes: "LDL slightly elevated. Recommend dietary adjustment.", doctor: "Dr. Marcus Chen" },
  { id: "r3", patientId: "p2", date: "2026-06-15", type: "Lab Report", title: "HbA1c Test", notes: "7.2% — above target. Adjust metformin dosage.", doctor: "Dr. Marcus Chen" },
  { id: "r4", patientId: "p3", date: "2026-05-28", type: "Imaging", title: "Tibia X-Ray", notes: "Clean fracture, cast applied. Recheck in 6 weeks.", doctor: "Dr. Elena Vargas" },
];

// Seed data used to initialize the mock "database" (localStorage) on first run.

export const seedUsers = [
  { id: "u1", name: "Ava Whitfield", email: "admin@vitalis.dev", password: "admin123", role: "ADMIN" },
  { id: "u2", name: "Dr. Marcus Chen", email: "doctor@vitalis.dev", password: "doctor123", role: "DOCTOR", specialization: "Cardiology" },
  { id: "u3", name: "Priya Nair", email: "staff@vitalis.dev", password: "staff123", role: "STAFF" },
  { id: "u4", name: "Daniel Osei", email: "patient@vitalis.dev", password: "patient123", role: "PATIENT", patientId: "p1" },
  { id: "u5", name: "Harsh Patel", email: "harsh@gmail.com", password: "123456", role: "PATIENT", patientId: "p1" },
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
  { id: "a2", patientId: "p1", patientName: "Daniel Osei", doctorId: "d2", doctorName: "Dr. Elena Vargas", date: "2026-07-12", time: "11:30", reason: "Orthopedic review", status: "Confirmed" },
  { id: "a3", patientId: "p1", patientName: "Daniel Osei", doctorId: "d3", doctorName: "Dr. Samuel Okafor", date: "2026-07-16", time: "09:00", reason: "Pediatric check-up", status: "Pending" },
  { id: "a4", patientId: "p1", patientName: "Daniel Osei", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2026-07-24", time: "15:00", reason: "Lab review", status: "Pending" },
  { id: "a5", patientId: "p1", patientName: "Daniel Osei", doctorId: "d2", doctorName: "Dr. Elena Vargas", date: "2026-08-03", time: "13:30", reason: "Cardiac rehabilitation", status: "Confirmed" },
  { id: "a6", patientId: "p1", patientName: "Daniel Osei", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2025-06-05", time: "08:30", reason: "Initial consultation", status: "Completed" },
  { id: "a7", patientId: "p1", patientName: "Daniel Osei", doctorId: "d2", doctorName: "Dr. Elena Vargas", date: "2025-05-21", time: "16:00", reason: "Hypertension review", status: "Completed" },
  { id: "a8", patientId: "p1", patientName: "Daniel Osei", doctorId: "d3", doctorName: "Dr. Samuel Okafor", date: "2025-04-09", time: "10:30", reason: "Lifestyle counseling", status: "Completed" },
  { id: "a9", patientId: "p1", patientName: "Daniel Osei", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2025-03-17", time: "12:00", reason: "Medication adjustment", status: "Completed" },
  { id: "a10", patientId: "p1", patientName: "Daniel Osei", doctorId: "d2", doctorName: "Dr. Elena Vargas", date: "2025-02-11", time: "14:30", reason: "Routine screening", status: "Completed" },
  { id: "a11", patientId: "p2", patientName: "Jane Smith", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2026-07-11", time: "14:30", reason: "Blood sugar review", status: "Pending" },
  { id: "a12", patientId: "p4", patientName: "Amara Diallo", doctorId: "d2", doctorName: "Dr. Elena Vargas", date: "2026-07-09", time: "11:00", reason: "Asthma check-up", status: "Confirmed" },
  { id: "a13", patientId: "p5", patientName: "Noah Becker", doctorId: "d1", doctorName: "Dr. Marcus Chen", date: "2026-07-14", time: "09:30", reason: "Cardiac review", status: "Confirmed" },
];

export const seedRecords = [
  { id: "r1", patientId: "p1", date: "2026-06-01", type: "Prescription", title: "Amlodipine 5mg", notes: "Once daily for blood pressure management. Review in 4 weeks.", doctor: "Dr. Marcus Chen" },
  { id: "r2", patientId: "p1", date: "2026-06-15", type: "Lab Report", title: "Lipid Panel", notes: "LDL slightly elevated. Recommend dietary adjustment.", doctor: "Dr. Marcus Chen" },
  { id: "r3", patientId: "p1", date: "2026-05-20", type: "Lab Report", title: "CBC", notes: "Normal blood count with no concerning findings.", doctor: "Dr. Marcus Chen" },
  { id: "r4", patientId: "p1", date: "2026-04-18", type: "Imaging", title: "Chest X-Ray", notes: "Clear lungs with no acute findings.", doctor: "Dr. Marcus Chen" },
  { id: "r5", patientId: "p1", date: "2026-03-12", type: "Prescription", title: "Metoprolol 50mg", notes: "Dose adjusted after review of blood pressure response.", doctor: "Dr. Marcus Chen" },
  { id: "r6", patientId: "p1", date: "2026-02-08", type: "Lab Report", title: "Kidney Function Panel", notes: "Creatinine and BUN within expected range.", doctor: "Dr. Marcus Chen" },
  { id: "r7", patientId: "p1", date: "2026-01-14", type: "Imaging", title: "ECG", notes: "Normal sinus rhythm observed.", doctor: "Dr. Marcus Chen" },
  { id: "r8", patientId: "p1", date: "2025-12-04", type: "Prescription", title: "Hydrochlorothiazide 12.5mg", notes: "Continued for blood pressure management.", doctor: "Dr. Marcus Chen" },
  { id: "r9", patientId: "p1", date: "2025-11-17", type: "Lab Report", title: "Thyroid Panel", notes: "Results stable; no change in medication required.", doctor: "Dr. Marcus Chen" },
  { id: "r10", patientId: "p1", date: "2025-10-02", type: "Prescription", title: "Omeprazole 20mg", notes: "Reassess if symptoms persist beyond 2 weeks.", doctor: "Dr. Marcus Chen" },
  { id: "r11", patientId: "p1", date: "2025-09-10", type: "Lab Report", title: "Blood Glucose", notes: "Fasting glucose normal; continue diet monitoring.", doctor: "Dr. Elena Vargas" },
  { id: "r12", patientId: "p1", date: "2025-08-22", type: "Lab Report", title: "Hemoglobin A1C", notes: "Stable trend; no emergency action needed.", doctor: "Dr. Elena Vargas" },
  { id: "r13", patientId: "p1", date: "2025-07-03", type: "Imaging", title: "MRI Brain", notes: "No abnormal findings reported.", doctor: "Dr. Samuel Okafor" },
  { id: "r14", patientId: "p1", date: "2025-06-19", type: "Lab Report", title: "Vitamin D", notes: "Deficiency corrected with supplementation.", doctor: "Dr. Samuel Okafor" },
  { id: "r15", patientId: "p1", date: "2025-05-28", type: "Prescription", title: "Vitamin D3 1000 IU", notes: "Take once daily with meals.", doctor: "Dr. Samuel Okafor" },
  { id: "r16", patientId: "p2", date: "2026-06-15", type: "Lab Report", title: "HbA1c Test", notes: "7.2% — above target. Adjust metformin dosage.", doctor: "Dr. Marcus Chen" },
  { id: "r17", patientId: "p3", date: "2025-05-28", type: "Imaging", title: "Tibia X-Ray", notes: "Clean fracture, cast applied. Recheck in 6 weeks.", doctor: "Dr. Elena Vargas" },
];

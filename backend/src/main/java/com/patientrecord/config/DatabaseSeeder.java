package com.patientrecord.config;

import com.patientrecord.entity.*;
import com.patientrecord.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private RefillRequestRepository refillRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedDatabase();
        }
        seedAdditionalRecords();
    }

    private void seedDatabase() {
        // 1. Seed Doctors
        Doctor d1 = Doctor.builder()
                .name("Dr. Marcus Chen")
                .specialization("Cardiology")
                .phone("9911223344")
                .email("doctor@vitalis.dev")
                .experience(12)
                .availability("Mon-Fri, 9AM-4PM")
                .build();
        doctorRepository.save(d1);

        Doctor d2 = Doctor.builder()
                .name("Dr. Elena Vargas")
                .specialization("Orthopedics")
                .phone("9911223355")
                .email("elena.vargas@vitalis.dev")
                .experience(8)
                .availability("Tue-Sat, 10AM-5PM")
                .build();
        doctorRepository.save(d2);

        Doctor d3 = Doctor.builder()
                .name("Dr. Samuel Okafor")
                .specialization("Pediatrics")
                .phone("9911223366")
                .email("samuel.okafor@vitalis.dev")
                .experience(15)
                .availability("Mon-Thu, 8AM-2PM")
                .build();
        doctorRepository.save(d3);

        // 2. Seed Patients
        Patient p1 = Patient.builder()
                .name("Daniel Osei")
                .age(36)
                .gender("Male")
                .dateOfBirth(LocalDate.of(1990, 5, 14))
                .bloodGroup("O+")
                .phone("9876543210")
                .email("patient@vitalis.dev") // to map user login to this patient
                .address("12 Maple St, Riverton")
                .emergencyContact("Kofi Osei (Brother) - 9876543211")
                .disease("Hypertension")
                .status("Admitted")
                .admittedDate(LocalDate.of(2026, 6, 1))
                .assignedDoctor("Dr. Marcus Chen")
                .build();
        patientRepository.save(p1);

        Patient p2 = Patient.builder()
                .name("Jane Smith")
                .age(40)
                .gender("Female")
                .dateOfBirth(LocalDate.of(1985, 11, 2))
                .bloodGroup("A+")
                .phone("9876500000")
                .email("jane.smith@mail.com")
                .address("456 Park Ave, Riverton")
                .emergencyContact("John Smith - 9876500001")
                .disease("Type 2 Diabetes")
                .status("Outpatient")
                .admittedDate(LocalDate.of(2026, 6, 15))
                .assignedDoctor("Dr. Marcus Chen")
                .build();
        patientRepository.save(p2);

        Patient p3 = Patient.builder()
                .name("Leo Martins")
                .age(48)
                .gender("Male")
                .dateOfBirth(LocalDate.of(1978, 2, 20))
                .bloodGroup("B-")
                .phone("9812345678")
                .email("leo.martins@mail.com")
                .address("9 Birch Lane, Fairview")
                .emergencyContact("Mary Martins - 9812345679")
                .disease("Fractured Tibia")
                .status("Discharged")
                .admittedDate(LocalDate.of(2026, 5, 28))
                .assignedDoctor("Dr. Marcus Chen")
                .build();
        patientRepository.save(p3);

        Patient p4 = Patient.builder()
                .name("Amara Diallo")
                .age(26)
                .gender("Female")
                .dateOfBirth(LocalDate.of(1999, 9, 9))
                .bloodGroup("AB+")
                .phone("9800112233")
                .email("amara.d@mail.com")
                .address("77 Lake Rd, Fairview")
                .emergencyContact("Ali Diallo - 9800112234")
                .disease("Asthma")
                .status("Outpatient")
                .admittedDate(LocalDate.of(2026, 6, 20))
                .assignedDoctor("Dr. Marcus Chen")
                .build();
        patientRepository.save(p4);

        Patient p5 = Patient.builder()
                .name("Noah Becker")
                .age(60)
                .gender("Male")
                .dateOfBirth(LocalDate.of(1965, 7, 30))
                .bloodGroup("O-")
                .phone("9845098450")
                .email("noah.b@mail.com")
                .address("3 Cedar Ct, Riverton")
                .emergencyContact("Greta Becker - 9845098451")
                .disease("Coronary Artery Disease")
                .status("Admitted")
                .admittedDate(LocalDate.of(2026, 6, 25))
                .assignedDoctor("Dr. Marcus Chen")
                .build();
        patientRepository.save(p5);

        // 3. Seed Users
        User uAdmin = User.builder()
                .name("Ava Whitfield")
                .email("admin@vitalis.dev")
                .password(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .phone("9900112233")
                .build();
        userRepository.save(uAdmin);

        User uDoctor = User.builder()
                .name("Dr. Marcus Chen")
                .email("doctor@vitalis.dev")
                .password(passwordEncoder.encode("doctor123"))
                .role("DOCTOR")
                .phone("9911223344")
                .build();
        userRepository.save(uDoctor);

        User uStaff = User.builder()
                .name("Priya Nair")
                .email("staff@vitalis.dev")
                .password(passwordEncoder.encode("staff123"))
                .role("STAFF")
                .phone("9922334455")
                .build();
        userRepository.save(uStaff);

        User uPatient = User.builder()
                .name("Daniel Osei")
                .email("patient@vitalis.dev")
                .password(passwordEncoder.encode("patient123"))
                .role("PATIENT")
                .phone("9876543210")
                .build();
        userRepository.save(uPatient);

        // 4. Seed Appointments
        Appointment a1 = Appointment.builder()
                .patient(p1)
                .doctor(d1)
                .appointmentDate(LocalDate.of(2026, 7, 10))
                .appointmentTime(LocalTime.of(10, 0))
                .reason("Follow-up consultation")
                .status("Confirmed")
                .patientName(p1.getName())
                .doctorName(d1.getName())
                .build();
        appointmentRepository.save(a1);

        Appointment a2 = Appointment.builder()
                .patient(p2)
                .doctor(d1)
                .appointmentDate(LocalDate.of(2026, 7, 11))
                .appointmentTime(LocalTime.of(14, 30))
                .reason("Blood sugar review")
                .status("Pending")
                .patientName(p2.getName())
                .doctorName(d1.getName())
                .build();
        appointmentRepository.save(a2);

        Appointment a3 = Appointment.builder()
                .patient(p4)
                .doctor(d2)
                .appointmentDate(LocalDate.of(2026, 7, 9))
                .appointmentTime(LocalTime.of(11, 0))
                .reason("Asthma check-up")
                .status("Confirmed")
                .patientName(p4.getName())
                .doctorName(d2.getName())
                .build();
        appointmentRepository.save(a3);

        Appointment a4 = Appointment.builder()
                .patient(p5)
                .doctor(d1)
                .appointmentDate(LocalDate.of(2026, 7, 14))
                .appointmentTime(LocalTime.of(9, 30))
                .reason("Cardiac review")
                .status("Confirmed")
                .patientName(p5.getName())
                .doctorName(d1.getName())
                .build();
        appointmentRepository.save(a4);

        // 5. Seed Medical Records
        MedicalRecord mr1 = MedicalRecord.builder()
                .patient(p1)
                .doctor(d1)
                .diagnosis("Amlodipine 5mg")
                .treatmentDetails("Once daily for blood pressure management. Review in 4 weeks.")
                .recordDate(LocalDate.of(2026, 6, 1))
                .type("Prescription")
                .title("Amlodipine 5mg")
                .notes("Once daily for blood pressure management. Review in 4 weeks.")
                .doctorName(d1.getName())
                .build();
        medicalRecordRepository.save(mr1);

        MedicalRecord mr2 = MedicalRecord.builder()
                .patient(p1)
                .doctor(d1)
                .diagnosis("Lipid Panel")
                .treatmentDetails("LDL slightly elevated. Recommend dietary adjustment.")
                .recordDate(LocalDate.of(2026, 6, 15))
                .type("Lab Report")
                .title("Lipid Panel")
                .notes("LDL slightly elevated. Recommend dietary adjustment.")
                .doctorName(d1.getName())
                .build();
        medicalRecordRepository.save(mr2);

        MedicalRecord mr3 = MedicalRecord.builder()
                .patient(p2)
                .doctor(d1)
                .diagnosis("HbA1c Test")
                .treatmentDetails("7.2% — above target. Adjust metformin dosage.")
                .recordDate(LocalDate.of(2026, 6, 15))
                .type("Lab Report")
                .title("HbA1c Test")
                .notes("7.2% — above target. Adjust metformin dosage.")
                .doctorName(d1.getName())
                .build();
        medicalRecordRepository.save(mr3);

        MedicalRecord mr4 = MedicalRecord.builder()
                .patient(p3)
                .doctor(d2)
                .diagnosis("Tibia X-Ray")
                .treatmentDetails("Clean fracture, cast applied. Recheck in 6 weeks.")
                .recordDate(LocalDate.of(2026, 5, 28))
                .type("Imaging")
                .title("Tibia X-Ray")
                .notes("Clean fracture, cast applied. Recheck in 6 weeks.")
                .doctorName(d2.getName())
                .build();
        medicalRecordRepository.save(mr4);

        // 6. Seed Prescriptions
        Prescription pr1 = Prescription.builder()
                .patient(p1)
                .name("Amlodipine")
                .dosage("5 mg")
                .duration("Daily for 30 days")
                .notes("Take with food and monitor blood pressure.")
                .status("Active")
                .build();
        prescriptionRepository.save(pr1);

        Prescription pr2 = Prescription.builder()
                .patient(p2)
                .name("Metformin XR")
                .dosage("500 mg")
                .duration("Every evening for 14 days")
                .notes("Continue until follow-up review.")
                .status("Active")
                .build();
        prescriptionRepository.save(pr2);

        // 7. Seed Refill Requests
        RefillRequest rr1 = RefillRequest.builder()
                .patient(p1)
                .patientName("Daniel Osei")
                .medication("Amlodipine")
                .dosage("5 mg")
                .requestNotes("I have one week left and would like a refill.")
                .status("Pending")
                .build();
        refillRequestRepository.save(rr1);
    }

    private void seedAdditionalRecords() {
        Patient p1 = patientRepository.findByEmailIgnoreCase("patient@vitalis.dev").orElse(null);
        Doctor d1 = doctorRepository.findByEmailIgnoreCase("doctor@vitalis.dev").orElse(null);

        if (p1 == null || d1 == null) {
            System.out.println("Seeding additional records skipped: Patient or Doctor not found.");
            return;
        }

        int prescriptionsInsertedCount = 0;
        int medicalRecordsInsertedCount = 0;

        // 1. Seed prescriptions to reach exactly 10 in the entire table
        String[] names = {
            "Atorvastatin", "Lisinopril", "Albuterol Inhaler",
            "Amoxicillin", "Omeprazole", "Gabapentin",
            "Levothyroxine", "Ibuprofen"
        };
        String[] dosages = {
            "20 mg", "10 mg", "2 puffs",
            "500 mg", "20 mg", "300 mg",
            "75 mcg", "400 mg"
        };
        String[] durations = {
            "Once daily at bedtime", "Once daily in the morning", "As needed (PRN) for shortness of breath",
            "Three times daily for 7 days", "Once daily before breakfast", "Three times daily",
            "Once daily on empty stomach", "Every 6 hours as needed for pain"
        };
        String[] notes = {
            "Avoid consuming grapefruit juice.", "Monitor for persistent dry cough.", "Keep with you at all times.",
            "Complete the entire course.", "Take 30 minutes before eating.", "May cause drowsiness. Avoid alcohol.",
            "Take 1 hour before breakfast with water.", "Take with food or milk to prevent stomach upset."
        };

        List<Prescription> existingPrescriptions = prescriptionRepository.findByPatientPatientId(p1.getPatientId());

        for (int i = 0; i < names.length; i++) {
            if (prescriptionRepository.count() >= 10) {
                break;
            }
            final String name = names[i];
            boolean alreadyExists = existingPrescriptions.stream()
                    .anyMatch(pr -> pr.getName().equalsIgnoreCase(name));
            if (!alreadyExists) {
                Prescription pr = Prescription.builder()
                        .patient(p1)
                        .name(name)
                        .dosage(dosages[i])
                        .duration(durations[i])
                        .notes(notes[i])
                        .status("Active")
                        .build();
                prescriptionRepository.save(pr);
                prescriptionsInsertedCount++;
            }
        }

        // 2. Seed medical records to reach exactly 5 in the entire table
        if (medicalRecordRepository.count() < 5) {
            List<MedicalRecord> existingRecords = medicalRecordRepository.findByPatientPatientId(p1.getPatientId());
            boolean recordExists = existingRecords.stream()
                    .anyMatch(r -> r.getTitle().equalsIgnoreCase("Chest X-Ray"));
            if (!recordExists) {
                MedicalRecord mr5 = MedicalRecord.builder()
                        .patient(p1)
                        .doctor(d1)
                        .diagnosis("Chest X-Ray")
                        .treatmentDetails("Clear lungs, no active cardiopulmonary disease.")
                        .recordDate(LocalDate.of(2026, 7, 10))
                        .type("Imaging")
                        .title("Chest X-Ray")
                        .notes("Clear lungs, no active cardiopulmonary disease.")
                        .doctorName(d1.getName())
                        .build();
                medicalRecordRepository.save(mr5);
                medicalRecordsInsertedCount++;
            }
        }

        System.out.println("DATABASE SEEDER: Inserted " + prescriptionsInsertedCount + " new Prescription(s) and " + medicalRecordsInsertedCount + " new MedicalRecord(s) in this run.");
    }
}

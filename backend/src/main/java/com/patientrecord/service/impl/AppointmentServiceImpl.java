package com.patientrecord.service.impl;

import com.patientrecord.dto.AppointmentDTO;
import com.patientrecord.entity.Appointment;
import com.patientrecord.entity.Doctor;
import com.patientrecord.entity.Patient;
import com.patientrecord.entity.Notification;
import com.patientrecord.entity.User;
import com.patientrecord.exception.ResourceNotFoundException;
import com.patientrecord.repository.AppointmentRepository;
import com.patientrecord.repository.DoctorRepository;
import com.patientrecord.repository.PatientRepository;
import com.patientrecord.repository.NotificationRepository;
import com.patientrecord.repository.UserRepository;
import com.patientrecord.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AppointmentDTO createAppointment(AppointmentDTO dto) {
        Patient patient = patientRepository.findById(Long.valueOf(dto.getPatientId()))
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(Long.valueOf(dto.getDoctorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(LocalDate.parse(dto.getDate()))
                .appointmentTime(LocalTime.parse(dto.getTime()))
                .status(dto.getStatus() != null ? dto.getStatus() : "Pending")
                .reason(dto.getReason())
                .patientName(patient.getName())
                .doctorName(doctor.getName())
                .remarks(dto.getRemarks())
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        // 1. Create a notification for the patient confirming that the appointment request has been submitted.
        Notification notifPatient = Notification.builder()
                .recipientRole("PATIENT")
                .recipientId(patient.getPatientId())
                .title("Appointment Request Submitted")
                .message("Your appointment request has been submitted successfully.")
                .isRead(false)
                .build();
        notificationRepository.save(notifPatient);

        // 2. Whenever a patient books an appointment, the doctor should immediately receive a notification
        Notification notifDoc = Notification.builder()
                .recipientRole("DOCTOR")
                .recipientId(doctor.getDoctorId())
                .title("New Appointment Request")
                .message("New appointment request received from " + patient.getName() + ".")
                .isRead(false)
                .build();
        notificationRepository.save(notifDoc);

        return convertToDTO(saved);
    }

    @Override
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientPatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorDoctorId(doctorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDTO updateAppointment(Long id, AppointmentDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        if (dto.getDate() != null) appointment.setAppointmentDate(LocalDate.parse(dto.getDate()));
        if (dto.getTime() != null) appointment.setAppointmentTime(LocalTime.parse(dto.getTime()));
        if (dto.getStatus() != null) appointment.setStatus(dto.getStatus());
        if (dto.getReason() != null) appointment.setReason(dto.getReason());
        if (dto.getRemarks() != null) appointment.setRemarks(dto.getRemarks());

        if (dto.getPatientId() != null) {
            Patient patient = patientRepository.findById(Long.valueOf(dto.getPatientId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));
            appointment.setPatient(patient);
            appointment.setPatientName(patient.getName());
        }

        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(Long.valueOf(dto.getDoctorId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));
            appointment.setDoctor(doctor);
            appointment.setDoctorName(doctor.getName());
        }

        Appointment updated = appointmentRepository.save(appointment);

        // Check if the update is done by doctor or staff (role is not PATIENT)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isPatient = false;
        if (auth != null) {
            isPatient = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));
        }

        if (!isPatient && auth != null) {
            String currentEmail = auth.getName();
            String updaterName = "Dr. Marcus Chen"; // fallback
            User currentUser = userRepository.findByEmail(currentEmail).orElse(null);
            if (currentUser != null) {
                updaterName = currentUser.getName();
            }
            if (!updaterName.startsWith("Dr. ")) {
                updaterName = "Dr. " + updaterName;
            }

            // 1. Patient notification with status and remarks
            String remarksText = updated.getRemarks();
            String patientMsg = "Your appointment status has been updated to " + updated.getStatus() + ".";
            if (remarksText != null && !remarksText.trim().isEmpty()) {
                patientMsg += " Remarks: " + remarksText;
            }

            if (updated.getPatient() != null) {
                Notification notifPatient = Notification.builder()
                        .recipientRole("PATIENT")
                        .recipientId(updated.getPatient().getPatientId())
                        .title("Appointment Updated")
                        .message(patientMsg)
                        .isRead(false)
                        .build();
                notificationRepository.save(notifPatient);
            }

            // 2. Staff notification
            Notification notifStaff = Notification.builder()
                    .recipientRole("STAFF")
                    .recipientId(null)
                    .title("Appointment Updated")
                    .message("Appointment for " + updated.getPatientName() + " has been updated by " + updaterName + ".")
                    .isRead(false)
                    .build();
            notificationRepository.save(notifStaff);
        }

        return convertToDTO(updated);
    }

    @Override
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    private AppointmentDTO convertToDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(String.valueOf(a.getAppointmentId()))
                .patientId(a.getPatient() != null ? String.valueOf(a.getPatient().getPatientId()) : null)
                .patientName(a.getPatientName())
                .doctorId(a.getDoctor() != null ? String.valueOf(a.getDoctor().getDoctorId()) : null)
                .doctorName(a.getDoctorName())
                .date(a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : null)
                .time(a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : null)
                .status(a.getStatus())
                .reason(a.getReason())
                .remarks(a.getRemarks())
                .build();
    }
}

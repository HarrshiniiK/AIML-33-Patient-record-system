package com.patientrecord.service.impl;

import com.patientrecord.dto.PrescriptionDTO;
import com.patientrecord.dto.RefillRequestDTO;
import com.patientrecord.entity.Patient;
import com.patientrecord.entity.Prescription;
import com.patientrecord.entity.RefillRequest;
import com.patientrecord.entity.Notification;
import com.patientrecord.entity.Doctor;
import com.patientrecord.exception.ResourceNotFoundException;
import com.patientrecord.repository.PatientRepository;
import com.patientrecord.repository.PrescriptionRepository;
import com.patientrecord.repository.RefillRequestRepository;
import com.patientrecord.repository.NotificationRepository;
import com.patientrecord.repository.DoctorRepository;
import com.patientrecord.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private RefillRequestRepository refillRequestRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<PrescriptionDTO> getAllPrescriptions(Long patientId) {
        List<Prescription> list;
        if (patientId != null) {
            list = prescriptionRepository.findByPatientPatientId(patientId);
        } else {
            list = prescriptionRepository.findAll();
        }
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public PrescriptionDTO createPrescription(PrescriptionDTO dto) {
        Patient patient = patientRepository.findById(Long.valueOf(dto.getPatientId()))
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Prescription p = Prescription.builder()
                .patient(patient)
                .name(dto.getName())
                .dosage(dto.getDosage())
                .duration(dto.getDuration())
                .notes(dto.getNotes())
                .status(dto.getStatus() != null ? dto.getStatus() : "Active")
                .build();

        Prescription saved = prescriptionRepository.save(p);
        return convertToDTO(saved);
    }

    @Override
    public RefillRequestDTO createRefillRequest(RefillRequestDTO dto) {
        Patient patient = null;
        if (dto.getPatientId() != null && !dto.getPatientId().isEmpty()) {
            patient = patientRepository.findById(Long.valueOf(dto.getPatientId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));
        }

        Long prescriptionId = dto.getPrescriptionId() != null && !dto.getPrescriptionId().isEmpty() ? Long.valueOf(dto.getPrescriptionId()) : null;
        
        Long doctorId = null;
        if (patient != null && patient.getAssignedDoctor() != null) {
            String docName = patient.getAssignedDoctor();
            Doctor doc = doctorRepository.findAll().stream()
                    .filter(d -> d.getName().equalsIgnoreCase(docName) || d.getName().toLowerCase().contains(docName.toLowerCase()))
                    .findFirst()
                    .orElse(null);
            if (doc != null) {
                doctorId = doc.getDoctorId();
            }
        }

        RefillRequest rr = RefillRequest.builder()
                .patient(patient)
                .patientName(dto.getPatientName())
                .medication(dto.getMedication())
                .dosage(dto.getDosage())
                .duration(dto.getDuration())
                .requestNotes(dto.getRequestNotes() != null ? dto.getRequestNotes() : dto.getPatientMessage())
                .status(dto.getStatus() != null ? dto.getStatus() : "PENDING")
                .decisionNotes(dto.getDecisionNotes() != null ? dto.getDecisionNotes() : dto.getDoctorMessage())
                .prescriptionId(prescriptionId)
                .doctorId(doctorId)
                .requestedAt(java.time.LocalDateTime.now())
                .patientMessage(dto.getPatientMessage() != null ? dto.getPatientMessage() : dto.getRequestNotes())
                .doctorMessage(dto.getDoctorMessage() != null ? dto.getDoctorMessage() : dto.getDecisionNotes())
                .build();

        RefillRequest saved = refillRequestRepository.save(rr);

        // Auto-generate notifications for DOCTOR and STAFF
        if (patient != null) {
            Notification notifDoc = Notification.builder()
                    .recipientRole("DOCTOR")
                    .recipientId(doctorId)
                    .title("New refill request")
                    .message("New refill request received from " + patient.getName() + ".")
                    .isRead(false)
                    .build();
            notificationRepository.save(notifDoc);

            Notification notifStaff = Notification.builder()
                    .recipientRole("STAFF")
                    .recipientId(null)
                    .title("New refill request")
                    .message("New refill request received from " + patient.getName() + ".")
                    .isRead(false)
                    .build();
            notificationRepository.save(notifStaff);
        }

        return convertToDTO(saved);
    }

    @Override
    public List<RefillRequestDTO> getAllRefillRequests(Long patientId) {
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));
        
        if (isPatient) {
            String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            Patient patient = patientRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient record not found for user: " + email));
            patientId = patient.getPatientId();
        }

        List<RefillRequest> list;
        if (patientId != null) {
            list = refillRequestRepository.findByPatientPatientId(patientId);
        } else {
            list = refillRequestRepository.findAll();
        }
        return list.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RefillRequestDTO updateRefillRequest(Long id, RefillRequestDTO dto) {
        RefillRequest rr = refillRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Refill request not found with id: " + id));

        String status = dto.getStatus() != null ? dto.getStatus() : (dto.getDecision() != null ? dto.getDecision() : rr.getStatus());
        rr.setStatus(status);

        String decisionNotes = dto.getDecisionNotes() != null ? dto.getDecisionNotes() : (dto.getReviewNotes() != null ? dto.getReviewNotes() : rr.getDecisionNotes());
        rr.setDecisionNotes(decisionNotes);

        if (dto.getDoctorMessage() != null) {
            rr.setDoctorMessage(dto.getDoctorMessage());
        } else if (dto.getReviewNotes() != null) {
            rr.setDoctorMessage(dto.getReviewNotes());
        }

        if (dto.getDuration() != null) {
            rr.setDuration(dto.getDuration());
        }

        if ("APPROVED".equalsIgnoreCase(status) || "Approved".equalsIgnoreCase(status)) {
            if (rr.getPrescriptionId() != null) {
                Prescription p = prescriptionRepository.findById(rr.getPrescriptionId()).orElse(null);
                if (p != null) {
                    if (dto.getMedication() != null) {
                        p.setName(dto.getMedication());
                    }
                    if (dto.getDosage() != null) {
                        p.setDosage(dto.getDosage());
                    }
                    if (dto.getDuration() != null) {
                        p.setDuration(dto.getDuration());
                    }
                    if (dto.getDoctorMessage() != null) {
                        p.setNotes(dto.getDoctorMessage());
                    } else if (dto.getReviewNotes() != null) {
                        p.setNotes(dto.getReviewNotes());
                    }
                    prescriptionRepository.save(p);
                }
            }

            String docEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            Doctor currentDoc = doctorRepository.findByEmailIgnoreCase(docEmail).orElse(null);
            String docName = currentDoc != null ? currentDoc.getName() : "Dr. Marcus Chen";
            if (!docName.startsWith("Dr. ")) {
                docName = "Dr. " + docName;
            }

            if (rr.getPatient() != null) {
                Notification patientNotif = Notification.builder()
                        .recipientRole("PATIENT")
                        .recipientId(rr.getPatient().getPatientId())
                        .title("Prescription Updated")
                        .message("Your prescription has been updated by " + docName + ".")
                        .isRead(false)
                        .build();
                notificationRepository.save(patientNotif);

                Notification staffNotif = Notification.builder()
                        .recipientRole("STAFF")
                        .recipientId(null)
                        .title("Prescription Updated")
                        .message("Prescription for " + rr.getPatient().getName() + " has been updated by " + docName + ".")
                        .isRead(false)
                        .build();
                notificationRepository.save(staffNotif);
            }
        }

        RefillRequest updated = refillRequestRepository.save(rr);
        return convertToDTO(updated);
    }

    private PrescriptionDTO convertToDTO(Prescription p) {
        return PrescriptionDTO.builder()
                .id(String.valueOf(p.getId()))
                .patientId(p.getPatient() != null ? String.valueOf(p.getPatient().getPatientId()) : null)
                .patientName(p.getPatient() != null ? p.getPatient().getName() : null)
                .name(p.getName())
                .dosage(p.getDosage())
                .duration(p.getDuration())
                .notes(p.getNotes())
                .status(p.getStatus())
                .build();
    }

    private RefillRequestDTO convertToDTO(RefillRequest rr) {
        return RefillRequestDTO.builder()
                .id(String.valueOf(rr.getId()))
                .patientId(rr.getPatient() != null ? String.valueOf(rr.getPatient().getPatientId()) : null)
                .patientName(rr.getPatientName())
                .medication(rr.getMedication())
                .dosage(rr.getDosage())
                .duration(rr.getDuration())
                .requestNotes(rr.getRequestNotes())
                .status(rr.getStatus())
                .decisionNotes(rr.getDecisionNotes())
                .decision(rr.getStatus())
                .reviewNotes(rr.getDecisionNotes())
                .prescriptionId(rr.getPrescriptionId() != null ? String.valueOf(rr.getPrescriptionId()) : null)
                .doctorId(rr.getDoctorId() != null ? String.valueOf(rr.getDoctorId()) : null)
                .requestedAt(rr.getRequestedAt() != null ? rr.getRequestedAt().toString() : null)
                .patientMessage(rr.getPatientMessage() != null ? rr.getPatientMessage() : rr.getRequestNotes())
                .doctorMessage(rr.getDoctorMessage() != null ? rr.getDoctorMessage() : rr.getDecisionNotes())
                .build();
    }
}

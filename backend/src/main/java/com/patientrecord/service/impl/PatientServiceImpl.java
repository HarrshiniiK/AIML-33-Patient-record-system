package com.patientrecord.service.impl;

import com.patientrecord.dto.PatientDTO;
import com.patientrecord.entity.Patient;
import com.patientrecord.exception.ResourceNotFoundException;
import com.patientrecord.repository.PatientRepository;
import com.patientrecord.service.PatientService;
import com.patientrecord.entity.User;
import com.patientrecord.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PatientDTO createPatient(PatientDTO dto) {
        String fullName = dto.getName();
        if (fullName == null || fullName.trim().isEmpty()) {
            fullName = (dto.getFirstName() != null ? dto.getFirstName() : "") + " " + (dto.getLastName() != null ? dto.getLastName() : "");
            fullName = fullName.trim();
        }

        Patient patient = Patient.builder()
                .name(fullName)
                .age(dto.getAge())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDob() != null && !dto.getDob().isEmpty() ? LocalDate.parse(dto.getDob()) : dto.getDateOfBirth())
                .bloodGroup(dto.getBloodGroup())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .emergencyContact(dto.getEmergencyContact())
                .disease(dto.getDisease())
                .status(dto.getStatus() != null ? dto.getStatus() : "Outpatient")
                .admittedDate(dto.getAdmittedDate() != null && !dto.getAdmittedDate().isEmpty() ? LocalDate.parse(dto.getAdmittedDate()) : null)
                .assignedDoctor(dto.getAssignedDoctor())
                .build();

        Patient saved = patientRepository.save(patient);
        return convertToDTO(saved);
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return convertToDTO(patient);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isPatient = false;
        if (authentication != null) {
            isPatient = authentication.getAuthorities().stream()
                    .anyMatch(auth -> "ROLE_PATIENT".equals(auth.getAuthority()));
        }
        if (isPatient) {
            String currentEmail = authentication.getName();
            if (patient.getEmail() == null || !patient.getEmail().equalsIgnoreCase(currentEmail)) {
                throw new AccessDeniedException("You are not authorized to update this profile.");
            }
        }

        String fullName = dto.getName();
        if (fullName == null || fullName.trim().isEmpty()) {
            fullName = (dto.getFirstName() != null ? dto.getFirstName() : "") + " " + (dto.getLastName() != null ? dto.getLastName() : "");
            fullName = fullName.trim();
        }
        if (!fullName.isEmpty()) {
            patient.setName(fullName);
        }

        if (dto.getAge() != null) patient.setAge(dto.getAge());
        if (dto.getGender() != null) patient.setGender(dto.getGender());
        
        if (dto.getDob() != null && !dto.getDob().isEmpty()) {
            patient.setDateOfBirth(LocalDate.parse(dto.getDob()));
        } else if (dto.getDateOfBirth() != null) {
            patient.setDateOfBirth(dto.getDateOfBirth());
        }

        String oldEmail = patient.getEmail();
        final String finalFullName = fullName;

        if (dto.getBloodGroup() != null) patient.setBloodGroup(dto.getBloodGroup());
        if (dto.getPhone() != null) patient.setPhone(dto.getPhone());
        if (dto.getEmail() != null) patient.setEmail(dto.getEmail());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
        if (dto.getEmergencyContact() != null) patient.setEmergencyContact(dto.getEmergencyContact());
        
        if (!isPatient) {
            if (dto.getDisease() != null) patient.setDisease(dto.getDisease());
            if (dto.getStatus() != null) patient.setStatus(dto.getStatus());
            
            if (dto.getAdmittedDate() != null) {
                patient.setAdmittedDate(dto.getAdmittedDate().isEmpty() ? null : LocalDate.parse(dto.getAdmittedDate()));
            }

            if (dto.getAssignedDoctor() != null) patient.setAssignedDoctor(dto.getAssignedDoctor());
        }

        if (oldEmail != null) {
            userRepository.findByEmail(oldEmail).ifPresent(user -> {
                if (finalFullName != null && !finalFullName.trim().isEmpty()) {
                    user.setName(finalFullName);
                }
                if (dto.getEmail() != null) {
                    user.setEmail(dto.getEmail());
                }
                if (dto.getPhone() != null) {
                    user.setPhone(dto.getPhone());
                }
                userRepository.save(user);
            });
        }

        Patient updated = patientRepository.save(patient);
        return convertToDTO(updated);
    }

    @Override
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    @Override
    public List<PatientDTO> searchPatients(String query) {
        return patientRepository.findByNameContainingIgnoreCaseOrDiseaseContainingIgnoreCase(query, query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PatientDTO convertToDTO(Patient p) {
        String name = p.getName() != null ? p.getName() : "";
        String firstName = "";
        String lastName = "";
        if (!name.isEmpty()) {
            String[] parts = name.split(" ", 2);
            firstName = parts[0];
            if (parts.length > 1) {
                lastName = parts[1];
            }
        }

        return PatientDTO.builder()
                .id(String.valueOf(p.getPatientId()))
                .name(p.getName())
                .firstName(firstName)
                .lastName(lastName)
                .age(p.getAge())
                .gender(p.getGender())
                .dateOfBirth(p.getDateOfBirth())
                .dob(p.getDateOfBirth() != null ? p.getDateOfBirth().toString() : null)
                .bloodGroup(p.getBloodGroup())
                .phone(p.getPhone())
                .email(p.getEmail())
                .address(p.getAddress())
                .emergencyContact(p.getEmergencyContact())
                .disease(p.getDisease())
                .status(p.getStatus())
                .admittedDate(p.getAdmittedDate() != null ? p.getAdmittedDate().toString() : null)
                .assignedDoctor(p.getAssignedDoctor())
                .build();
    }
}

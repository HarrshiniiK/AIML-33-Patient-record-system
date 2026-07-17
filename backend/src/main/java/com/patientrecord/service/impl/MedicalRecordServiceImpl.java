package com.patientrecord.service.impl;

import com.patientrecord.dto.MedicalRecordDTO;
import com.patientrecord.entity.Doctor;
import com.patientrecord.entity.MedicalRecord;
import com.patientrecord.entity.Patient;
import com.patientrecord.exception.ResourceNotFoundException;
import com.patientrecord.repository.DoctorRepository;
import com.patientrecord.repository.MedicalRecordRepository;
import com.patientrecord.repository.PatientRepository;
import com.patientrecord.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public MedicalRecordDTO createRecord(MedicalRecordDTO dto) {
        Patient patient = patientRepository.findById(Long.valueOf(dto.getPatientId()))
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = null;
        if (dto.getDoctorId() != null && !dto.getDoctorId().isEmpty()) {
            doctor = doctorRepository.findById(Long.valueOf(dto.getDoctorId())).orElse(null);
        }

        String doctorName = dto.getDoctor();
        if (doctor != null && (doctorName == null || doctorName.isEmpty())) {
            doctorName = doctor.getName();
        }

        // If doctorId is missing but doctorName is present, try to lookup by name
        if (doctor == null && doctorName != null && !doctorName.isEmpty()) {
            List<Doctor> list = doctorRepository.findAll();
            for (Doctor d : list) {
                if (d.getName().equalsIgnoreCase(doctorName)) {
                    doctor = d;
                    break;
                }
            }
        }

        MedicalRecord record = MedicalRecord.builder()
                .patient(patient)
                .doctor(doctor)
                .diagnosis(dto.getDiagnosis() != null ? dto.getDiagnosis() : dto.getTitle())
                .symptoms(dto.getSymptoms())
                .medicines(dto.getMedicines())
                .treatmentDetails(dto.getTreatmentDetails() != null ? dto.getTreatmentDetails() : dto.getNotes())
                .recordDate(dto.getRecordDate() != null ? LocalDate.parse(dto.getRecordDate()) : (dto.getDate() != null ? LocalDate.parse(dto.getDate()) : LocalDate.now()))
                .type(dto.getType())
                .title(dto.getTitle())
                .notes(dto.getNotes() != null ? dto.getNotes() : dto.getTreatmentDetails())
                .doctorName(doctorName)
                .build();

        MedicalRecord saved = medicalRecordRepository.save(record);
        return convertToDTO(saved);
    }

    @Override
    public List<MedicalRecordDTO> getAllRecords() {
        return medicalRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordDTO> getRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientPatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalRecordDTO updateRecord(Long id, MedicalRecordDTO dto) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));

        if (dto.getDiagnosis() != null) record.setDiagnosis(dto.getDiagnosis());
        if (dto.getSymptoms() != null) record.setSymptoms(dto.getSymptoms());
        if (dto.getMedicines() != null) record.setMedicines(dto.getMedicines());
        if (dto.getTreatmentDetails() != null) record.setTreatmentDetails(dto.getTreatmentDetails());
        if (dto.getRecordDate() != null) record.setRecordDate(LocalDate.parse(dto.getRecordDate()));
        if (dto.getType() != null) record.setType(dto.getType());
        if (dto.getTitle() != null) record.setTitle(dto.getTitle());
        if (dto.getNotes() != null) record.setNotes(dto.getNotes());
        if (dto.getDoctor() != null) record.setDoctorName(dto.getDoctor());

        MedicalRecord updated = medicalRecordRepository.save(record);
        return convertToDTO(updated);
    }

    @Override
    public void deleteRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medical record not found with id: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }

    private MedicalRecordDTO convertToDTO(MedicalRecord r) {
        return MedicalRecordDTO.builder()
                .id(String.valueOf(r.getRecordId()))
                .patientId(r.getPatient() != null ? String.valueOf(r.getPatient().getPatientId()) : null)
                .patientName(r.getPatient() != null ? r.getPatient().getName() : null)
                .doctorId(r.getDoctor() != null ? String.valueOf(r.getDoctor().getDoctorId()) : null)
                .doctor(r.getDoctorName())
                .diagnosis(r.getDiagnosis())
                .symptoms(r.getSymptoms())
                .medicines(r.getMedicines())
                .treatmentDetails(r.getTreatmentDetails())
                .recordDate(r.getRecordDate() != null ? r.getRecordDate().toString() : null)
                .date(r.getRecordDate() != null ? r.getRecordDate().toString() : null)
                .type(r.getType())
                .title(r.getTitle())
                .notes(r.getNotes())
                .build();
    }
}

package com.patientrecord.service.impl;

import com.patientrecord.dto.DoctorDTO;
import com.patientrecord.entity.Doctor;
import com.patientrecord.exception.ResourceNotFoundException;
import com.patientrecord.repository.DoctorRepository;
import com.patientrecord.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public DoctorDTO createDoctor(DoctorDTO dto) {
        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .experience(dto.getExperience())
                .availability(dto.getAvailability())
                .build();
        Doctor saved = doctorRepository.save(doctor);
        return convertToDTO(saved);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return convertToDTO(doctor);
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (dto.getName() != null) doctor.setName(dto.getName());
        if (dto.getSpecialization() != null) doctor.setSpecialization(dto.getSpecialization());
        if (dto.getPhone() != null) doctor.setPhone(dto.getPhone());
        if (dto.getEmail() != null) doctor.setEmail(dto.getEmail());
        if (dto.getExperience() != null) doctor.setExperience(dto.getExperience());
        if (dto.getAvailability() != null) doctor.setAvailability(dto.getAvailability());

        Doctor updated = doctorRepository.save(doctor);
        return convertToDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    private DoctorDTO convertToDTO(Doctor d) {
        return DoctorDTO.builder()
                .id(String.valueOf(d.getDoctorId()))
                .name(d.getName())
                .specialization(d.getSpecialization())
                .phone(d.getPhone())
                .email(d.getEmail())
                .experience(d.getExperience())
                .availability(d.getAvailability())
                .build();
    }
}

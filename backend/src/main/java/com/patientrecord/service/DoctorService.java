package com.patientrecord.service;

import com.patientrecord.dto.DoctorDTO;
import java.util.List;

public interface DoctorService {
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    List<DoctorDTO> getAllDoctors();
    DoctorDTO getDoctorById(Long id);
    DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO);
    void deleteDoctor(Long id);
}

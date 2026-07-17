package com.patientrecord.repository;

import com.patientrecord.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmailIgnoreCase(String email);
    List<Patient> findByNameContainingIgnoreCaseOrDiseaseContainingIgnoreCase(String name, String disease);
}

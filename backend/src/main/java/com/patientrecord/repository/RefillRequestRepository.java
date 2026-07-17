package com.patientrecord.repository;

import com.patientrecord.entity.RefillRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RefillRequestRepository extends JpaRepository<RefillRequest, Long> {
    List<RefillRequest> findByPatientPatientId(Long patientId);
}

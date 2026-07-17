package com.patientrecord.service;

import com.patientrecord.dto.PrescriptionDTO;
import com.patientrecord.dto.RefillRequestDTO;
import java.util.List;

public interface PrescriptionService {
    List<PrescriptionDTO> getAllPrescriptions(Long patientId);
    PrescriptionDTO createPrescription(PrescriptionDTO dto);
    
    RefillRequestDTO createRefillRequest(RefillRequestDTO dto);
    List<RefillRequestDTO> getAllRefillRequests(Long patientId);
    RefillRequestDTO updateRefillRequest(Long id, RefillRequestDTO dto);
}

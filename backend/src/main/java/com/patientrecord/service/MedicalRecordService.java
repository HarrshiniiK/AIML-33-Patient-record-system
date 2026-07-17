package com.patientrecord.service;

import com.patientrecord.dto.MedicalRecordDTO;
import java.util.List;

public interface MedicalRecordService {
    MedicalRecordDTO createRecord(MedicalRecordDTO recordDTO);
    List<MedicalRecordDTO> getAllRecords();
    List<MedicalRecordDTO> getRecordsByPatientId(Long patientId);
    MedicalRecordDTO updateRecord(Long id, MedicalRecordDTO recordDTO);
    void deleteRecord(Long id);
}

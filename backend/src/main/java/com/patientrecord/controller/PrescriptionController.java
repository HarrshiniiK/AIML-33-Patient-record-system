package com.patientrecord.controller;

import com.patientrecord.dto.PrescriptionDTO;
import com.patientrecord.dto.RefillRequestDTO;
import com.patientrecord.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions(@RequestParam(value = "patientId", required = false) Long patientId) {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions(patientId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions(patientId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'STAFF')")
    public ResponseEntity<PrescriptionDTO> createPrescription(@RequestBody PrescriptionDTO dto) {
        return new ResponseEntity<>(prescriptionService.createPrescription(dto), HttpStatus.CREATED);
    }

    @PostMapping("/refills")
    public ResponseEntity<RefillRequestDTO> createRefillRequest(@RequestBody RefillRequestDTO dto) {
        return new ResponseEntity<>(prescriptionService.createRefillRequest(dto), HttpStatus.CREATED);
    }

    @GetMapping("/refills")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'STAFF', 'PATIENT')")
    public ResponseEntity<List<RefillRequestDTO>> getAllRefillRequests(@RequestParam(value = "patientId", required = false) Long patientId) {
        return ResponseEntity.ok(prescriptionService.getAllRefillRequests(patientId));
    }

    @PutMapping("/refills/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'STAFF')")
    public ResponseEntity<RefillRequestDTO> updateRefillRequest(@PathVariable Long id, @RequestBody RefillRequestDTO dto) {
        return ResponseEntity.ok(prescriptionService.updateRefillRequest(id, dto));
    }
}

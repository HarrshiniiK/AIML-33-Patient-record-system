package com.patientrecord.service.impl;

import com.patientrecord.config.JwtTokenProvider;
import com.patientrecord.dto.*;
import com.patientrecord.entity.Patient;
import com.patientrecord.entity.User;
import com.patientrecord.exception.BadRequestException;
import com.patientrecord.exception.ResourceNotFoundException;
import com.patientrecord.repository.PatientRepository;
import com.patientrecord.repository.UserRepository;
import com.patientrecord.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole().toUpperCase() : "PATIENT")
                .phone(request.getPhone())
                .build();

        User savedUser = userRepository.save(user);

        String patientIdStr = null;
        if ("PATIENT".equals(savedUser.getRole())) {
            Optional<Patient> existingPatient = patientRepository.findByEmailIgnoreCase(savedUser.getEmail());
            if (existingPatient.isPresent()) {
                patientIdStr = String.valueOf(existingPatient.get().getPatientId());
            } else {
                Patient patient = Patient.builder()
                        .name(savedUser.getName())
                        .email(savedUser.getEmail())
                        .phone(savedUser.getPhone())
                        .status("Outpatient")
                        .build();
                Patient savedPatient = patientRepository.save(patient);
                patientIdStr = String.valueOf(savedPatient.getPatientId());
            }
        }

        String token = jwtTokenProvider.generateToken(savedUser.getEmail());

        return AuthResponse.builder()
                .id(String.valueOf(savedUser.getId()))
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .phone(savedUser.getPhone())
                .token(token)
                .patientId(patientIdStr)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String patientIdStr = null;
        if ("PATIENT".equals(user.getRole())) {
            Optional<Patient> patient = patientRepository.findByEmailIgnoreCase(user.getEmail());
            if (patient.isPresent()) {
                patientIdStr = String.valueOf(patient.get().getPatientId());
            }
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .id(String.valueOf(user.getId()))
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .token(token)
                .patientId(patientIdStr)
                .build();
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(role.toUpperCase());
        User updated = userRepository.save(user);
        return convertToDTO(updated);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getRole() != null) user.setRole(dto.getRole().toUpperCase());
        User updated = userRepository.save(user);
        return convertToDTO(updated);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole().toUpperCase() : "STAFF")
                .phone(request.getPhone())
                .build();

        User savedUser = userRepository.save(user);

        if ("PATIENT".equals(savedUser.getRole())) {
            Optional<Patient> existingPatient = patientRepository.findByEmailIgnoreCase(savedUser.getEmail());
            if (existingPatient.isEmpty()) {
                Patient patient = Patient.builder()
                        .name(savedUser.getName())
                        .email(savedUser.getEmail())
                        .phone(savedUser.getPhone())
                        .status("Outpatient")
                        .build();
                patientRepository.save(patient);
            }
        }

        return convertToDTO(savedUser);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(String.valueOf(user.getId()))
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .build();
    }
}

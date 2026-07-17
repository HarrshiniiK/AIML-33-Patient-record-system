package com.patientrecord.service;

import com.patientrecord.dto.*;
import java.util.List;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    UserDTO updateUserRole(Long id, String role);
    UserDTO updateUser(Long id, UserDTO dto);
    void deleteUser(Long id);
    UserDTO createUser(RegisterRequest request);
}

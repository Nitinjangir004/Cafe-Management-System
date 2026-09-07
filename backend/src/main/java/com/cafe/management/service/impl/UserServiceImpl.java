package com.cafe.management.service.impl;

import com.cafe.management.dto.ChangePasswordRequest;
import com.cafe.management.dto.LoginRequest;
import com.cafe.management.dto.SignupRequest;
import com.cafe.management.dto.UserDto;
import com.cafe.management.entity.User;
import com.cafe.management.exception.ResourceNotFoundException;
import com.cafe.management.repository.UserRepository;
import com.cafe.management.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Map<String, Object> signUp(SignupRequest request) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> existing = userRepository.findByEmail(request.getEmail().trim().toLowerCase());
        if (existing.isPresent()) {
            response.put("status", false);
            response.put("message", "Email already exists.");
            return response;
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setContactNumber(request.getContactNumber().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(request.getPassword().trim());
        user.setStatus("true");
        user.setRole("user");

        userRepository.save(user);

        response.put("status", true);
        response.put("message", "Successfully Registered.");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (userOpt.isEmpty()) {
            response.put("status", false);
            response.put("message", "Bad Credentials.");
            return response;
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword().trim())) {
            response.put("status", false);
            response.put("message", "Bad Credentials.");
            return response;
        }

        if ("false".equalsIgnoreCase(user.getStatus())) {
            response.put("status", false);
            response.put("message", "Wait for admin approval.");
            return response;
        }

        String mockToken = "token_" + Base64.getEncoder().encodeToString((user.getEmail() + ":" + user.getRole()).getBytes());

        response.put("status", true);
        response.put("message", "Login Successful");
        response.put("token", mockToken);
        response.put("role", user.getRole());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("contactNumber", user.getContactNumber());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> !"admin".equalsIgnoreCase(u.getRole()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> updateStatus(Long id, String status) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setStatus(status);
        userRepository.save(user);

        response.put("status", true);
        response.put("message", "User Status Updated Successfully");
        return response;
    }

    @Override
    public Map<String, Object> changePassword(ChangePasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.getPassword().equals(request.getOldPassword().trim())) {
            response.put("status", false);
            response.put("message", "Incorrect Old Password.");
            return response;
        }

        user.setPassword(request.getNewPassword().trim());
        userRepository.save(user);

        response.put("status", true);
        response.put("message", "Password Updated Successfully.");
        return response;
    }

    @Override
    public Map<String, Object> forgotPassword(String email) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty()) {
            response.put("status", false);
            response.put("message", "Check your mail for Credentials.");
            return response;
        }

        response.put("status", true);
        response.put("message", "Check your mail for Credentials.");
        return response;
    }

    @Override
    public Map<String, Object> checkToken() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", true);
        response.put("message", "true");
        return response;
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getContactNumber(),
                user.getEmail(),
                user.getStatus(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}

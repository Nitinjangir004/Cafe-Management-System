package com.cafe.management.service;

import com.cafe.management.dto.ChangePasswordRequest;
import com.cafe.management.dto.LoginRequest;
import com.cafe.management.dto.SignupRequest;
import com.cafe.management.dto.UserDto;

import java.util.List;
import java.util.Map;

public interface UserService {
    Map<String, Object> signUp(SignupRequest request);
    Map<String, Object> login(LoginRequest request);
    List<UserDto> getAllUsers();
    Map<String, Object> updateStatus(Long id, String status);
    Map<String, Object> changePassword(ChangePasswordRequest request);
    Map<String, Object> forgotPassword(String email);
    Map<String, Object> checkToken();
}

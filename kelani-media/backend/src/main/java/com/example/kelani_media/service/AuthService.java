package com.example.kelani_media.service;

import com.example.kelani_media.dto.auth.*;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    EmailCheckResponse checkEmail(String email);
}

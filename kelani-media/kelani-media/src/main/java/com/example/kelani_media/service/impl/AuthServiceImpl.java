package com.example.kelani_media.service.impl;

import com.example.kelani_media.dto.auth.*;
import com.example.kelani_media.exception.ApiException;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.UserRepository;
import com.example.kelani_media.security.JwtTokenProvider;
import com.example.kelani_media.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse signup(SignupRequest request) {
        // Validate Kelaniya email
        if (!isValidKelaniEmail(request.getEmail())) {
            throw new ApiException("Please use your University of Kelaniya email address (ending with kln.ac.lk)", HttpStatus.BAD_REQUEST);
        }

        // Check passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("Passwords do not match", HttpStatus.BAD_REQUEST);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("An account with this email already exists", HttpStatus.CONFLICT);
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .birthday(request.getBirthday())
                .faculty(request.getFaculty())
                .degreeProgram(request.getDegreeProgram())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        // Generate token
        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .faculty(user.getFaculty())
                .degreeProgram(user.getDegreeProgram())
                .message("Account created successfully!")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .faculty(user.getFaculty())
                .degreeProgram(user.getDegreeProgram())
                .message("Login successful!")
                .build();
    }

    @Override
    public EmailCheckResponse checkEmail(String email) {
        boolean isValidFormat = isValidKelaniEmail(email);
        boolean isAvailable = !userRepository.existsByEmail(email.toLowerCase());

        String message;
        if (!isValidFormat) {
            message = "Please use your University of Kelaniya email address";
        } else if (!isAvailable) {
            message = "An account with this email already exists";
        } else {
            message = "Email is valid and available";
        }

        return EmailCheckResponse.builder()
                .valid(isValidFormat)
                .available(isAvailable)
                .message(message)
                .build();
    }

    private boolean isValidKelaniEmail(String email) {
        if (email == null) return false;
        String lowerEmail = email.toLowerCase();
        return lowerEmail.endsWith("@kln.ac.lk") ||
               lowerEmail.endsWith(".kln.ac.lk");
    }
}

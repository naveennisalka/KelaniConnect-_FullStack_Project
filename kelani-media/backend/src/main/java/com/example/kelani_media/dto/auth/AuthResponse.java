package com.example.kelani_media.dto.auth;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String faculty;
    private String degreeProgram;
    private List<String> roles;
    private String message;
}

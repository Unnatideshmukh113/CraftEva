package com.crafteva.services;

import com.crafteva.dto.AuthResponse;
import com.crafteva.dto.LoginRequest;
import com.crafteva.dto.RegisterRequest;

public interface UserService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}

package com.crafteva.services;

import com.crafteva.dto.AuthResponse;
import com.crafteva.dto.LoginRequest;
import com.crafteva.dto.RegisterRequest;
import com.crafteva.entity.User;
import com.crafteva.repository.UserRepository;
import com.crafteva.security.CustomUserDetailsService;
import com.crafteva.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    // REGISTER
    @Override
    public AuthResponse register(RegisterRequest request) {
    	
    	  if (userRepository.existsByEmail(request.getEmail())) {
              throw new RuntimeException("Email already registered");
          }

    	  User user = new User();
          user.setName(request.getName());
          user.setEmail(request.getEmail());
          user.setPassword(passwordEncoder.encode(request.getPassword()));
          user.setMobile(request.getMobile());
          user.setAddress(request.getAddress());
          user.setRole(request.getRole());

          User savedUser = userRepository.save(user);
          
          UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
          String token = jwtUtil.generateToken(userDetails, savedUser.getRole().name());
          
          return new AuthResponse(token, savedUser.getEmail(), savedUser.getRole().name(), savedUser.getUserId());
      }

    // LOGIN
    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());
        
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), user.getUserId());
    }
}

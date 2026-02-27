package com.crafteva.controller;

import com.crafteva.dto.AdminDashboardDto;
import com.crafteva.entity.Order;
import com.crafteva.entity.Payment;
import com.crafteva.entity.Product;
import com.crafteva.entity.User;
import com.crafteva.repository.OrderRepository;
import com.crafteva.repository.PaymentRepository;
import com.crafteva.repository.ProductRepository;
import com.crafteva.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    // Dashboard Statistics
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalPayments = paymentRepository.count();
        
        double totalRevenue = paymentRepository.findAll().stream()
                .mapToDouble(Payment::getAmount)
                .sum();
        
        return new AdminDashboardDto(totalUsers, totalProducts, totalOrders, totalPayments, totalRevenue);
    }

    // User Management
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public User getUserById(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return "User deleted successfully";
    }

    // Product Management
    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteProduct(@PathVariable Long productId) {
        productRepository.deleteById(productId);
        return "Product deleted successfully";
    }

    // Order Management
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/orders/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Order getOrderById(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Payment Management
    @GetMapping("/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/payments/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Payment getPaymentById(@PathVariable Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}

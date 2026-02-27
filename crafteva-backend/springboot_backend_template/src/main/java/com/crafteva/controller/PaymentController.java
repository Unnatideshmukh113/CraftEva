package com.crafteva.controller;

import com.crafteva.dto.PaymentDto;
import com.crafteva.dto.PaymentGatewayRequest;
import com.crafteva.dto.PaymentGatewayResponse;
import com.crafteva.entity.Payment;
import com.crafteva.services.PaymentService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // MAKE PAYMENT (Direct - without gateway)
    @PostMapping
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public PaymentDto makePayment(@Valid @RequestBody PaymentDto payment) {
        return paymentService.makePayment(payment);
    }

    // PROCESS PAYMENT THROUGH GATEWAY
    @PostMapping("/gateway")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public PaymentGatewayResponse processPaymentWithGateway(@Valid @RequestBody PaymentGatewayRequest request) {
        return paymentService.processPaymentWithGateway(request);
    }
    
    // LIST ALL PAYMENTS (ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // LIST PAYMENTS BY SELLER
    @GetMapping("/seller/{sellerId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public List<Payment> getPaymentsBySeller(@PathVariable Long sellerId) {
        return paymentService.getPaymentsBySeller(sellerId);
    }
}

   
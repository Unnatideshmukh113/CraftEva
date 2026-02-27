package com.crafteva.services;

import com.crafteva.dto.PaymentGatewayRequest;
import com.crafteva.dto.PaymentGatewayResponse;

public interface PaymentGatewayService {
    PaymentGatewayResponse processPayment(PaymentGatewayRequest request);
    PaymentGatewayResponse verifyPayment(String transactionId);
}

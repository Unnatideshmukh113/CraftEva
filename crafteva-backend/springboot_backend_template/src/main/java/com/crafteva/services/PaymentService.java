package com.crafteva.services;

import java.util.List;

import com.crafteva.dto.PaymentDto;
import com.crafteva.dto.PaymentGatewayRequest;
import com.crafteva.dto.PaymentGatewayResponse;
import com.crafteva.entity.Payment;
public interface PaymentService {


	PaymentDto makePayment(PaymentDto paymentDto);

	PaymentGatewayResponse processPaymentWithGateway(PaymentGatewayRequest request);

	List<Payment> getAllPayments();

	List<Payment> getPaymentsBySeller(Long sellerId);
}

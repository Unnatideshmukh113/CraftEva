package com.crafteva.services;

import com.crafteva.dto.PaymentGatewayRequest;
import com.crafteva.dto.PaymentGatewayResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@Slf4j
public class PaymentGatewayServiceImpl implements PaymentGatewayService {

    // Mock payment gateway - simulates Stripe/Razorpay-like behavior
    private static final Pattern CARD_PATTERN = Pattern.compile("^\\d{13,19}$");
    private static final Pattern CVV_PATTERN = Pattern.compile("^\\d{3,4}$");
    private static final Pattern EXPIRY_PATTERN = Pattern.compile("^(0[1-9]|1[0-2])/\\d{2}$");

    @Override
    public PaymentGatewayResponse processPayment(PaymentGatewayRequest request) {
        log.info("Processing payment for order: {}", request.getOrderId());
        
        // Validate card details
        if (!isValidCardNumber(request.getCardNumber())) {
            return new PaymentGatewayResponse(
                false,
                null,
                "Invalid card number",
                "FAILED",
                request.getAmount(),
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        }

        if (!isValidCVV(request.getCvv())) {
            return new PaymentGatewayResponse(
                false,
                null,
                "Invalid CVV",
                "FAILED",
                request.getAmount(),
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        }

        if (!isValidExpiry(request.getExpiryDate())) {
            return new PaymentGatewayResponse(
                false,
                null,
                "Invalid expiry date",
                "FAILED",
                request.getAmount(),
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        }

        // Simulate payment processing delay
        try {
            Thread.sleep(1000); // Simulate network delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Mock payment success/failure logic
        // In real implementation, this would call actual payment gateway API
        boolean paymentSuccess = simulatePaymentProcessing(request);

        if (paymentSuccess) {
            String transactionId = "TXN_" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
            log.info("Payment successful. Transaction ID: {}", transactionId);
            
            return new PaymentGatewayResponse(
                true,
                transactionId,
                "Payment processed successfully",
                "SUCCESS",
                request.getAmount(),
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        } else {
            log.warn("Payment failed for order: {}", request.getOrderId());
            return new PaymentGatewayResponse(
                false,
                null,
                "Payment failed. Please check your card details or try again.",
                "FAILED",
                request.getAmount(),
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        }
    }

    @Override
    public PaymentGatewayResponse verifyPayment(String transactionId) {
        log.info("Verifying payment for transaction: {}", transactionId);
        
        // In real implementation, this would query the payment gateway
        // For mock, we'll simulate a successful verification
        if (transactionId != null && transactionId.startsWith("TXN_")) {
            return new PaymentGatewayResponse(
                true,
                transactionId,
                "Payment verified successfully",
                "SUCCESS",
                null,
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        }
        
        return new PaymentGatewayResponse(
            false,
            transactionId,
            "Transaction not found",
            "FAILED",
            null,
            LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    private boolean isValidCardNumber(String cardNumber) {
        if (cardNumber == null) return false;
        String cleaned = cardNumber.replaceAll("\\s+", "");
        return CARD_PATTERN.matcher(cleaned).matches();
    }

    private boolean isValidCVV(String cvv) {
        return cvv != null && CVV_PATTERN.matcher(cvv).matches();
    }

    private boolean isValidExpiry(String expiry) {
        if (expiry == null) return false;
        if (!EXPIRY_PATTERN.matcher(expiry).matches()) return false;
        
        try {
            String[] parts = expiry.split("/");
            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt("20" + parts[1]);
            
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiryDate = LocalDateTime.of(year, month, 1, 0, 0);
            
            return expiryDate.isAfter(now);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean simulatePaymentProcessing(PaymentGatewayRequest request) {
        // Mock logic: Payment fails if card number ends with certain digits
        // In production, this would be an actual API call to payment gateway
        String lastDigit = request.getCardNumber().substring(request.getCardNumber().length() - 1);
        
        // Simulate 90% success rate
        return !lastDigit.equals("0");
    }
}

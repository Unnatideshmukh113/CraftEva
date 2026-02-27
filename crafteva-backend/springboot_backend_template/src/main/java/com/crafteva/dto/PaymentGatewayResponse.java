package com.crafteva.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentGatewayResponse {
    private boolean success;
    private String transactionId;
    private String message;
    private String status; // SUCCESS, FAILED, PENDING
    private Double amount;
    private String timestamp;
}

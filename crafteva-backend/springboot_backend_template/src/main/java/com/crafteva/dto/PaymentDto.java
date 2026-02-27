package com.crafteva.dto;


import com.crafteva.entity.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto {

    private double amount;
    private PaymentStatus paymentStatus;
    private OrderPaymentDto order;
    private SellerDto seller;

}

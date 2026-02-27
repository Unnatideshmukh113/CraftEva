package com.crafteva.dto;

import java.time.LocalDate;

import com.crafteva.entity.OrderStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class OrderPaymentDto {
	 private Long orderId;
	 private LocalDate orderDate;
	    private OrderStatus status;
	    private double totalAmount;
	    
	    @JsonProperty(access = Access.READ_ONLY)
	    private BuyerDto buyer;
}

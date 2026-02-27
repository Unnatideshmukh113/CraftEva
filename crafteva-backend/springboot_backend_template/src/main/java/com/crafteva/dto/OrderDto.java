package com.crafteva.dto;

import java.time.LocalDate;

import com.crafteva.entity.OrderStatus;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class OrderDto {
	 private Long orderId;
	 private LocalDate orderDate;
	    private OrderStatus status;
	    private double totalAmount;
	    private BuyerDto buyer;
}

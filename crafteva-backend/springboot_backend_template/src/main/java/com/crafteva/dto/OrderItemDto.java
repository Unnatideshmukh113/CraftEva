package com.crafteva.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto {
	private Long orderItemId;
    private int quantity;
    private double price;
    private PItemDto product;
    private OItemDto order;
}

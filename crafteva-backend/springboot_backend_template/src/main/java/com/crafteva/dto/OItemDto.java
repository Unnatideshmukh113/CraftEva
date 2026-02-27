package com.crafteva.dto;


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

public class OItemDto {
	 private Long orderId;
	 private double totalAmount;
	 @JsonProperty(access = Access.READ_ONLY)
	 private BuyerDto buyer;
}

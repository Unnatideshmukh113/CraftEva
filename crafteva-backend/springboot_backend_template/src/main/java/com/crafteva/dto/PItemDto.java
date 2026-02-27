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

public class PItemDto {
	private Long productId;
	private String productName;
	 private String description;
	 private double price;
	 private String imageUrl;
	 
	 @JsonProperty(access = Access.READ_ONLY)
	 private SellerDto seller;
}

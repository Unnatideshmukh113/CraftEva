package com.crafteva.dto;

import com.crafteva.entity.Category;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ProductDto {
	 private Long productId;
	 private String productName;
	 private String description;
	 private double price;
	 private String imageUrl;
	 private Category category;
	 private SellerDto seller;

}

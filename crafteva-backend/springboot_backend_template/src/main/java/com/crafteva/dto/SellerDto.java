package com.crafteva.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SellerDto {
	 private Long userId;
	 private String name;
	 private String mobile;
	 private String address;
	 private String email;
}

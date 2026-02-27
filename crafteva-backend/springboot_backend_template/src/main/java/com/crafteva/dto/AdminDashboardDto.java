package com.crafteva.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardDto {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private long totalPayments;
    private double totalRevenue;
}

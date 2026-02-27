package com.crafteva.services;

import com.crafteva.dto.OrderDto;

import com.crafteva.entity.Order;

import java.util.List;

public interface OrderService {

    OrderDto placeOrder(OrderDto orderDto);

    List<Order> getAllOrders();

    List<Order> getOrdersByBuyer(Long buyerId);

    List<Order> getOrderHistory(Long buyerId);

    Order cancelOrder(Long orderId);

	
}

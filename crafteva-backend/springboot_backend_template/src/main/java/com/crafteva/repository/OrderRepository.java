package com.crafteva.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crafteva.entity.Order;
import com.crafteva.entity.OrderStatus;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByBuyer_UserId(Long buyerId);
    List<Order> findByBuyer_UserIdAndStatusNot(Long buyerId, OrderStatus status);
}

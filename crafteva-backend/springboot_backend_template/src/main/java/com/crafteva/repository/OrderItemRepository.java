package com.crafteva.repository;

import com.crafteva.entity.Order;
import com.crafteva.entity.OrderItem;
import com.crafteva.entity.Product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

	Optional<OrderItem> findByOrderAndProduct(Order order, Product product);
	
	// Use JOIN FETCH to eagerly load product and order relationships
	@Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.product JOIN FETCH oi.order WHERE oi.order.orderId = :orderId")
	List<OrderItem> findByOrder_OrderId(@Param("orderId") Long orderId);
}

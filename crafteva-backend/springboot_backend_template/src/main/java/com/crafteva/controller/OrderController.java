package com.crafteva.controller;

import com.crafteva.dto.OrderDto;
import com.crafteva.dto.OrderPaymentDto;
import com.crafteva.entity.Order;
import com.crafteva.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public OrderDto place(@Valid @RequestBody OrderDto orderDto) {
        return service.placeOrder(orderDto);
    }

    @GetMapping("/get")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> all() {
        return service.getAllOrders();
    }

    @GetMapping("/buyer/{buyerId}")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public List<Order> getOrdersByBuyer(@PathVariable Long buyerId) {
        return service.getOrdersByBuyer(buyerId);
    }

    @GetMapping("/history/{buyerId}")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public List<Order> getOrderHistory(@PathVariable Long buyerId) {
        return service.getOrderHistory(buyerId);
    }

    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public Order cancel(@PathVariable Long id) {
        return service.cancelOrder(id);
    }
}

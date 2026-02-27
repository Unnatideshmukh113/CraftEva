package com.crafteva.controller;

import com.crafteva.dto.OrderItemDto;
import com.crafteva.entity.OrderItem;
import com.crafteva.services.OrderItemService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    // ADD ITEM TO CART
    @PostMapping("/add")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public OrderItemDto addToCart(@Valid @RequestBody OrderItemDto dto) {
        return orderItemService.addOrderItem(dto);
    }

    // VIEW CART ITEMS BY ORDER ID
    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public List<OrderItem> getOrderItems(@PathVariable Long orderId) {
        return orderItemService.getOrderItemsByOrderId(orderId);
    }

    // REMOVE ITEM FROM CART
    @DeleteMapping("/{orderItemId}")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public String removeOrderItem(@PathVariable Long orderItemId) {
        orderItemService.removeOrderItem(orderItemId);
        return "Order item removed successfully";
    }
}

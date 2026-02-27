package com.crafteva.services;

import com.crafteva.dto.OrderItemDto;
import com.crafteva.entity.OrderItem;

import java.util.List;

public interface OrderItemService {

	OrderItemDto addOrderItem(OrderItemDto orderItemDto);

    List<OrderItem> getOrderItemsByOrderId(Long orderId);

    void removeOrderItem(Long orderItemId);
}

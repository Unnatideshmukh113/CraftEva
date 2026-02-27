package com.crafteva.services;

import com.crafteva.dto.OItemDto;
import com.crafteva.dto.OrderItemDto;
import com.crafteva.dto.PItemDto;
import com.crafteva.entity.Order;
import com.crafteva.entity.OrderItem;
import com.crafteva.entity.OrderStatus;
import com.crafteva.entity.Product;
import com.crafteva.repository.OrderItemRepository;
import com.crafteva.repository.OrderRepository;
import com.crafteva.repository.ProductRepository;
import com.crafteva.services.OrderItemService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public OrderItemDto addOrderItem(OrderItemDto dto) {

        // 1️⃣ Fetch Order (Cart)
        Order order = orderRepository.findById(dto.getOrder().getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new RuntimeException("Order is not a cart");
        }

        // 2️⃣ Fetch Product
        Product product = productRepository.findById(dto.getProduct().getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 3️⃣ Find existing item or create new
        OrderItem orderItem = orderItemRepository
                .findByOrderAndProduct(order, product)
                .orElse(new OrderItem());

        // 4️⃣ Update item
        orderItem.setOrder(order);
        orderItem.setProduct(product);

        int quantity = (orderItem.getOrderItemId() == null)
                ? dto.getQuantity()
                : orderItem.getQuantity() + dto.getQuantity();

        orderItem.setQuantity(quantity);
        orderItem.setPrice(product.getPrice() * quantity);

        // 5️⃣ Save item
        OrderItem savedItem = orderItemRepository.save(orderItem);

        // 6️⃣ Update order total
        order.setTotalAmount(order.getTotalAmount() + product.getPrice() * dto.getQuantity());
        orderRepository.save(order);

        // 7️⃣ AUTO Entity → DTO mapping
        OrderItemDto response = modelMapper.map(savedItem, OrderItemDto.class);
        response.setOrder(modelMapper.map(order, OItemDto.class));
        response.setProduct(modelMapper.map(product, PItemDto.class));

        return response;
    }



    // GET ITEMS OF A PARTICULAR ORDER
    @Override
    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        // Use repository method with JOIN FETCH to eagerly load relationships
        // This prevents lazy loading errors when serializing to JSON
        return orderItemRepository.findByOrder_OrderId(orderId);
    }

    // REMOVE ITEM FROM CART
    @Override
    public void removeOrderItem(Long orderItemId) {
        orderItemRepository.deleteById(orderItemId);
    }
}

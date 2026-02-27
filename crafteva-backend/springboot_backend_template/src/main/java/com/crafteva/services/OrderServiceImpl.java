package com.crafteva.services;

import com.crafteva.dto.BuyerDto;
import com.crafteva.dto.OrderDto;
import com.crafteva.dto.OrderPaymentDto;
import com.crafteva.entity.Order;
import com.crafteva.entity.OrderStatus;
import com.crafteva.entity.User;
import com.crafteva.repository.OrderRepository;
import com.crafteva.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

   
    @Override
    public OrderDto placeOrder(OrderDto orderDto) {
    	
    	Long buyerId = orderDto.getBuyer().getUserId();

    	   User buyer = userRepository.findById(buyerId)
                   .orElseThrow(() -> new RuntimeException("Buyer not found"));

           // 3️⃣ DTO → Entity
           Order order = new Order();
           order.setOrderDate(LocalDate.now());
           order.setStatus(OrderStatus.PLACED);
           order.setTotalAmount(orderDto.getTotalAmount());
           order.setBuyer(buyer);

           // 4️⃣ Save order
           Order savedOrder = orderRepository.save(order);

           // 5️⃣ Entity → DTO (response)
           OrderDto response = new OrderDto();
           response.setOrderId(savedOrder.getOrderId());
           response.setOrderDate(savedOrder.getOrderDate());
           response.setStatus(savedOrder.getStatus());
           response.setTotalAmount(savedOrder.getTotalAmount());

           BuyerDto buyerDto = new BuyerDto();
           buyerDto.setUserId(buyer.getUserId());
           buyerDto.setName(buyer.getName());
           buyerDto.setMobile(buyer.getMobile());
           buyerDto.setAddress(buyer.getAddress());
           buyerDto.setEmail(buyer.getEmail());

           response.setBuyer(buyerDto);

           return response;
       }


    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyer_UserId(buyerId);
    }

    @Override
    public List<Order> getOrderHistory(Long buyerId) {
        return orderRepository.findByBuyer_UserIdAndStatusNot(buyerId, OrderStatus.PLACED);
    }

    @Override
    public Order cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

		
}

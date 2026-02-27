package com.crafteva.services;

import com.crafteva.dto.PaymentDto;
import com.crafteva.dto.PaymentGatewayRequest;
import com.crafteva.dto.PaymentGatewayResponse;
import com.crafteva.dto.OrderDto;
import com.crafteva.dto.OrderPaymentDto;
import com.crafteva.dto.SellerDto;
import com.crafteva.entity.*;

import com.crafteva.repository.OrderItemRepository;
import com.crafteva.repository.OrderRepository;
import com.crafteva.repository.PaymentRepository;
import com.crafteva.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PaymentGatewayService paymentGatewayService;

    @Override
    public PaymentDto makePayment(PaymentDto paymentDto) {

        // fetch order
        Order order = orderRepository.findById(
                paymentDto.getOrder().getOrderId()
        ).orElseThrow(() -> new RuntimeException("Order not found"));

        // Validate payment amount matches order total
        if (Math.abs(paymentDto.getAmount() - order.getTotalAmount()) > 0.01) {
            throw new RuntimeException("Payment amount does not match order total");
        }

        // fetch seller
        User seller = userRepository.findById(
                paymentDto.getSeller().getUserId()
        ).orElseThrow(() -> new RuntimeException("Seller not found"));

        // save payment
        Payment payment = new Payment();
        payment.setAmount(paymentDto.getAmount());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setOrder(order);
        payment.setSeller(seller);
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        // AUTO MAP ORDER → OrderDto (buyer included automatically)
        OrderPaymentDto orderDto = modelMapper.map(order, OrderPaymentDto.class);

        // AUTO MAP SELLER → SellerDto
        SellerDto sellerDto = modelMapper.map(seller, SellerDto.class);

        PaymentDto response = new PaymentDto();
        response.setAmount(savedPayment.getAmount());
        response.setPaymentStatus(savedPayment.getPaymentStatus());
        response.setOrder(orderDto);
        response.setSeller(sellerDto);

        return response;
    }

    public PaymentGatewayResponse processPaymentWithGateway(PaymentGatewayRequest request) {
        // Process payment through gateway
        PaymentGatewayResponse gatewayResponse = paymentGatewayService.processPayment(request);

        if (gatewayResponse.isSuccess()) {
            // Fetch order
            Order order = orderRepository.findById(Long.parseLong(request.getOrderId()))
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Validate amount
            if (Math.abs(request.getAmount() - order.getTotalAmount()) > 0.01) {
                throw new RuntimeException("Payment amount does not match order total");
            }

            // Get seller from order items (first product's seller)
            List<OrderItem> orderItems = orderItemRepository.findByOrder_OrderId(order.getOrderId());
            User seller = orderItems.stream()
                    .findFirst()
                    .map(item -> item.getProduct().getSeller())
                    .orElseThrow(() -> new RuntimeException("No seller found for order"));

            // Save payment with transaction ID
            Payment payment = new Payment();
            payment.setAmount(request.getAmount());
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(gatewayResponse.getTransactionId());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setOrder(order);
            payment.setSeller(seller);

            paymentRepository.save(payment);

            // Update order status to COMPLETED
            order.setStatus(OrderStatus.COMPLETED);
            orderRepository.save(order);
        }

        return gatewayResponse;
    }


    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
 // 🔹 SELLER PAYMENTS
    @Override
    public List<Payment> getPaymentsBySeller(Long sellerId) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("User is not a seller");
        }

        return paymentRepository.findBySeller(seller);
    }
}

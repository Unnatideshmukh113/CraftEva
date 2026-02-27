package com.crafteva.entity;



import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="payment")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(name="amount", nullable=false)
    private double amount;
    
   
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name="transaction_id", unique=true)
    private String transactionId;

    @Column(name="payment_date")
    private LocalDateTime paymentDate;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

}

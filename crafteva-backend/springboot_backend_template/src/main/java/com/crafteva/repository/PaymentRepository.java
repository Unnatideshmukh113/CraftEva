package com.crafteva.repository;

import com.crafteva.entity.Payment;
import com.crafteva.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

	List<Payment> findBySeller(User seller);
}

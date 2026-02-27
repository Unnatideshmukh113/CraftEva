package com.crafteva.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    @Column(name="product_name", nullable=false)
    private String productName;
    @Column(name="description", nullable=false)
    private String description;
    @Column(name="price", nullable=false)
    private double price;
    @Column(name="image_URL", nullable=false)
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    @Column(name="category", nullable=false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

   
}

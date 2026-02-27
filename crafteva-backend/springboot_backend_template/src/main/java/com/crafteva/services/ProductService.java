package com.crafteva.services;

import com.crafteva.dto.ProductDto;
import com.crafteva.dto.UpdateProductDto;
import com.crafteva.entity.Product;

import java.util.List;

public interface ProductService {

	ProductDto addProduct(ProductDto productDto);

    List<Product> getAllProducts();

    Product updateProduct(Long productId, UpdateProductDto dto);

    void deleteProduct(Long productId);

	
}

package com.crafteva.services;

import com.crafteva.dto.ProductDto;
import com.crafteva.dto.SellerDto;
import com.crafteva.dto.UpdateProductDto;
import com.crafteva.entity.Product;
import com.crafteva.entity.Role;
import com.crafteva.entity.User;
import com.crafteva.repository.ProductRepository;
import com.crafteva.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

	 private final ProductRepository productRepository;
	    private final UserRepository userRepository;

	    @Override
	    public ProductDto addProduct(ProductDto productDto) {

	        // 1️⃣ Extract sellerId from SellerDto
	        Long sellerId = productDto.getSeller().getUserId();

	        // 2️⃣ Fetch Seller (User entity)
	        User seller = userRepository.findById(sellerId)
	                .orElseThrow(() -> new RuntimeException("Seller not found"));

	        //Check Seller is present in Role or not
	        if (seller.getRole() != Role.SELLER) {
	            throw new RuntimeException("User is not a seller");
	        }

	        // 3️⃣ DTO → Entity
	        Product product = new Product();
	        product.setProductName(productDto.getProductName());
	        product.setDescription(productDto.getDescription());
	        product.setPrice(productDto.getPrice());
	        product.setCategory(productDto.getCategory());
	        product.setImageUrl(productDto.getImageUrl());
	        product.setSeller(seller);

	        // 4️⃣ Save product
	        Product savedProduct = productRepository.save(product);

	        // 5️⃣ Entity → DTO (response)
	        SellerDto sellerDto = new SellerDto(
	                seller.getUserId(),
	                seller.getName(),
	                seller.getMobile(),
	                seller.getAddress(),
	                seller.getEmail()
	        );

	        ProductDto response = new ProductDto();
	        response.setProductId(savedProduct.getProductId());
	        response.setProductName(savedProduct.getProductName());
	        response.setDescription(savedProduct.getDescription());
	        response.setPrice(savedProduct.getPrice());
	        response.setCategory(savedProduct.getCategory());
	        response.setImageUrl(savedProduct.getImageUrl());
	        response.setSeller(sellerDto);

	        return response;
	    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product updateProduct(Long id, UpdateProductDto dto) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());
        product.setCategory(dto.getCategory());

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}

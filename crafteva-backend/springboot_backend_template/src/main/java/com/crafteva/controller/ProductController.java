package com.crafteva.controller;

import com.crafteva.dto.ProductDto;
import com.crafteva.dto.UpdateProductDto;
import com.crafteva.entity.Product;
import com.crafteva.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ProductDto add(@Valid @RequestBody ProductDto productdto) {
        return service.addProduct(productdto);
    }

    @GetMapping
    public List<Product> all() {
        return service.getAllProducts();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public Product update(@PathVariable Long id,
                          @Valid @RequestBody UpdateProductDto dto) {
        return service.updateProduct(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public String delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Deleted successfully";
    }
}

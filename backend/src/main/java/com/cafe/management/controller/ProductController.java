package com.cafe.management.controller;

import com.cafe.management.dto.ProductDto;
import com.cafe.management.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addProduct(@Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.addProduct(dto));
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/getByCategory/{id}")
    public ResponseEntity<List<ProductDto>> getByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getByCategory(id));
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateProduct(@Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProduct(dto));
    }

    @PostMapping("/updateStatus")
    public ResponseEntity<Map<String, Object>> updateStatus(@RequestBody Map<String, Object> body) {
        Long id = Long.valueOf(body.get("id").toString());
        String status = body.get("status").toString();
        return ResponseEntity.ok(productService.updateStatus(id, status));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.deleteProduct(id));
    }
}

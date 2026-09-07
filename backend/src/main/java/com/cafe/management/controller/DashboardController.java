package com.cafe.management.controller;

import com.cafe.management.repository.CafeBillRepository;
import com.cafe.management.repository.ProductCategoryRepository;
import com.cafe.management.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CafeBillRepository cafeBillRepository;

    public DashboardController(ProductCategoryRepository categoryRepository,
                               ProductRepository productRepository,
                               CafeBillRepository cafeBillRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cafeBillRepository = cafeBillRepository;
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getDashboardDetails() {
        Map<String, Object> map = new HashMap<>();
        map.put("category", categoryRepository.count());
        map.put("product", productRepository.count());
        map.put("bill", cafeBillRepository.count());
        return ResponseEntity.ok(map);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return getDashboardDetails();
    }
}

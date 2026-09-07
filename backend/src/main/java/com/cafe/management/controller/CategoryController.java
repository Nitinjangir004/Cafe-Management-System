package com.cafe.management.controller;

import com.cafe.management.dto.ProductCategoryDto;
import com.cafe.management.service.ProductCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final ProductCategoryService categoryService;

    public CategoryController(ProductCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addCategory(@Valid @RequestBody ProductCategoryDto dto) {
        return ResponseEntity.ok(categoryService.addCategory(dto));
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProductCategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateCategory(@Valid @RequestBody ProductCategoryDto dto) {
        return ResponseEntity.ok(categoryService.updateCategory(dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}

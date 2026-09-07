package com.cafe.management.service.impl;

import com.cafe.management.dto.ProductCategoryDto;
import com.cafe.management.entity.ProductCategory;
import com.cafe.management.exception.ResourceNotFoundException;
import com.cafe.management.repository.ProductCategoryRepository;
import com.cafe.management.service.ProductCategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository categoryRepository;

    public ProductCategoryServiceImpl(ProductCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Map<String, Object> addCategory(ProductCategoryDto dto) {
        Map<String, Object> response = new HashMap<>();
        String name = dto.getName().trim();
        if (categoryRepository.findByNameIgnoreCase(name).isPresent()) {
            response.put("status", false);
            response.put("message", "Category already exists.");
            return response;
        }

        ProductCategory category = new ProductCategory();
        category.setName(name);
        categoryRepository.save(category);

        response.put("status", true);
        response.put("message", "Category Added Successfully");
        response.put("id", category.getId());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new ProductCategoryDto(c.getId(), c.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> updateCategory(ProductCategoryDto dto) {
        Map<String, Object> response = new HashMap<>();
        ProductCategory category = categoryRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getId()));

        category.setName(dto.getName().trim());
        categoryRepository.save(category);

        response.put("status", true);
        response.put("message", "Category Updated Successfully");
        return response;
    }

    @Override
    public Map<String, Object> deleteCategory(Long id) {
        Map<String, Object> response = new HashMap<>();
        if (!categoryRepository.existsById(id)) {
            response.put("status", false);
            response.put("message", "Category not found");
            return response;
        }
        categoryRepository.deleteById(id);
        response.put("status", true);
        response.put("message", "Category Deleted Successfully");
        return response;
    }
}

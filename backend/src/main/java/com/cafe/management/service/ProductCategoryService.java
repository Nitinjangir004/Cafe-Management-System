package com.cafe.management.service;

import com.cafe.management.dto.ProductCategoryDto;

import java.util.List;
import java.util.Map;

public interface ProductCategoryService {
    Map<String, Object> addCategory(ProductCategoryDto dto);
    List<ProductCategoryDto> getAllCategories();
    Map<String, Object> updateCategory(ProductCategoryDto dto);
    Map<String, Object> deleteCategory(Long id);
}

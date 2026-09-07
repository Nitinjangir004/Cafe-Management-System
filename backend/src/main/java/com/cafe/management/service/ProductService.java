package com.cafe.management.service;

import com.cafe.management.dto.ProductDto;

import java.util.List;
import java.util.Map;

public interface ProductService {
    Map<String, Object> addProduct(ProductDto dto);
    List<ProductDto> getAllProducts();
    List<ProductDto> getByCategory(Long categoryId);
    ProductDto getById(Long id);
    Map<String, Object> updateProduct(ProductDto dto);
    Map<String, Object> updateStatus(Long id, String status);
    Map<String, Object> deleteProduct(Long id);
}

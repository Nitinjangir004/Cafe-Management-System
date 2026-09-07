package com.cafe.management.service.impl;

import com.cafe.management.dto.ProductDto;
import com.cafe.management.entity.Product;
import com.cafe.management.entity.ProductCategory;
import com.cafe.management.exception.ResourceNotFoundException;
import com.cafe.management.repository.ProductCategoryRepository;
import com.cafe.management.repository.ProductRepository;
import com.cafe.management.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, ProductCategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Map<String, Object> addProduct(ProductDto dto) {
        Map<String, Object> response = new HashMap<>();
        ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Product product = new Product();
        product.setName(dto.getName().trim());
        product.setCategory(category);
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStatus(dto.getStatus() != null ? dto.getStatus() : "true");

        productRepository.save(product);

        response.put("status", true);
        response.put("message", "Product Added Successfully");
        response.put("id", product.getId());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .filter(p -> "true".equalsIgnoreCase(p.getStatus()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toDto(product);
    }

    @Override
    public Map<String, Object> updateProduct(ProductDto dto) {
        Map<String, Object> response = new HashMap<>();
        Product product = productRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + dto.getId()));

        if (dto.getCategoryId() != null) {
            ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        if (dto.getName() != null) product.setName(dto.getName().trim());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());

        productRepository.save(product);

        response.put("status", true);
        response.put("message", "Product Updated Successfully");
        return response;
    }

    @Override
    public Map<String, Object> updateStatus(Long id, String status) {
        Map<String, Object> response = new HashMap<>();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setStatus(status);
        productRepository.save(product);

        response.put("status", true);
        response.put("message", "Product Status Updated Successfully");
        return response;
    }

    @Override
    public Map<String, Object> deleteProduct(Long id) {
        Map<String, Object> response = new HashMap<>();
        if (!productRepository.existsById(id)) {
            response.put("status", false);
            response.put("message", "Product not found");
            return response;
        }

        productRepository.deleteById(id);
        response.put("status", true);
        response.put("message", "Product Deleted Successfully");
        return response;
    }

    private ProductDto toDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getDescription(),
                product.getPrice(),
                product.getStatus()
        );
    }
}

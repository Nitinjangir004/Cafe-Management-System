package com.cafe.management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CafeBillDto {
    private Long id;
    private String uuid;
    private String name;
    private String email;
    private String contactNumber;
    private String paymentMethod;
    private BigDecimal totalAmount;
    private String productDetails;
    private String createdBy;
    private LocalDateTime createdAt;

    public CafeBillDto() {}

    public CafeBillDto(Long id, String uuid, String name, String email, String contactNumber,
                       String paymentMethod, BigDecimal totalAmount, String productDetails,
                       String createdBy, LocalDateTime createdAt) {
        this.id = id;
        this.uuid = uuid;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.productDetails = productDetails;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getProductDetails() { return productDetails; }
    public void setProductDetails(String productDetails) { this.productDetails = productDetails; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

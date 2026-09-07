package com.cafe.management.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CafeBillRequest {

    @NotBlank
    private String name;

    private String email;

    private String contactNumber;

    private String paymentMethod;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal totalAmount;

    private String productDetails;

    private String createdBy;

    public CafeBillRequest() {}

    public CafeBillRequest(String name, String email, String contactNumber, String paymentMethod,
                           BigDecimal totalAmount, String productDetails, String createdBy) {
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.productDetails = productDetails;
        this.createdBy = createdBy;
    }

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
}

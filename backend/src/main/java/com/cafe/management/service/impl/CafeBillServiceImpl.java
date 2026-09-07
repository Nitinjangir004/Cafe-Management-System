package com.cafe.management.service.impl;

import com.cafe.management.dto.CafeBillDto;
import com.cafe.management.dto.CafeBillRequest;
import com.cafe.management.entity.CafeBill;
import com.cafe.management.exception.ResourceNotFoundException;
import com.cafe.management.repository.CafeBillRepository;
import com.cafe.management.service.CafeBillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CafeBillServiceImpl implements CafeBillService {

    private final CafeBillRepository billRepository;

    public CafeBillServiceImpl(CafeBillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @Override
    public Map<String, Object> generateReport(CafeBillRequest request) {
        Map<String, Object> response = new HashMap<>();

        String uuid = "BILL-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        CafeBill bill = new CafeBill();
        bill.setUuid(uuid);
        bill.setName(request.getName().trim());
        bill.setEmail(request.getEmail() != null ? request.getEmail().trim() : "");
        bill.setContactNumber(request.getContactNumber() != null ? request.getContactNumber().trim() : "");
        bill.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cash");
        bill.setTotalAmount(request.getTotalAmount());
        bill.setProductDetails(request.getProductDetails());
        bill.setCreatedBy(request.getCreatedBy() != null ? request.getCreatedBy() : "Staff");

        billRepository.save(bill);

        response.put("status", true);
        response.put("message", "Bill Generated Successfully");
        response.put("uuid", uuid);
        response.put("id", bill.getId());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CafeBillDto> getBills() {
        return billRepository.findAll().stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CafeBillDto getBillById(Long id) {
        CafeBill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        return toDto(bill);
    }

    @Override
    public Map<String, Object> deleteBill(Long id) {
        Map<String, Object> response = new HashMap<>();
        if (!billRepository.existsById(id)) {
            response.put("status", false);
            response.put("message", "Bill id does not exist");
            return response;
        }

        billRepository.deleteById(id);
        response.put("status", true);
        response.put("message", "Bill Deleted Successfully");
        return response;
    }

    private CafeBillDto toDto(CafeBill bill) {
        return new CafeBillDto(
                bill.getId(),
                bill.getUuid(),
                bill.getName(),
                bill.getEmail(),
                bill.getContactNumber(),
                bill.getPaymentMethod(),
                bill.getTotalAmount(),
                bill.getProductDetails(),
                bill.getCreatedBy(),
                bill.getCreatedAt()
        );
    }
}

package com.cafe.management.service;

import com.cafe.management.dto.CafeBillDto;
import com.cafe.management.dto.CafeBillRequest;

import java.util.List;
import java.util.Map;

public interface CafeBillService {
    Map<String, Object> generateReport(CafeBillRequest request);
    List<CafeBillDto> getBills();
    CafeBillDto getBillById(Long id);
    Map<String, Object> deleteBill(Long id);
}

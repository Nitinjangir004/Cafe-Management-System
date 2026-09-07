package com.cafe.management.controller;

import com.cafe.management.dto.CafeBillDto;
import com.cafe.management.dto.CafeBillRequest;
import com.cafe.management.service.CafeBillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bill")
public class BillController {

    private final CafeBillService billService;

    public BillController(CafeBillService billService) {
        this.billService = billService;
    }

    @PostMapping("/generateReport")
    public ResponseEntity<Map<String, Object>> generateReport(@Valid @RequestBody CafeBillRequest request) {
        return ResponseEntity.ok(billService.generateReport(request));
    }

    @GetMapping("/getBills")
    public ResponseEntity<List<CafeBillDto>> getBills() {
        return ResponseEntity.ok(billService.getBills());
    }

    @GetMapping("/getPdf/{id}")
    public ResponseEntity<CafeBillDto> getPdf(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteBill(@PathVariable Long id) {
        return ResponseEntity.ok(billService.deleteBill(id));
    }
}

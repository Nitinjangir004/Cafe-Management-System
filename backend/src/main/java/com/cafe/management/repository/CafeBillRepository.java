package com.cafe.management.repository;

import com.cafe.management.entity.CafeBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CafeBillRepository extends JpaRepository<CafeBill, Long> {
    Optional<CafeBill> findByUuid(String uuid);
    List<CafeBill> findByCreatedBy(String createdBy);
}

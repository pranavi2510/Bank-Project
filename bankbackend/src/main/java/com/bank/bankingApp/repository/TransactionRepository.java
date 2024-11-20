package com.bank.bankingApp.repository;

import com.bank.bankingApp.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Find transactions by user ID
    List<Transaction> findByUserId(Long userId);
}

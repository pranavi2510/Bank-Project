package com.bank.bankingApp.controller;

import com.bank.bankingApp.model.Transaction;
import com.bank.bankingApp.service.TransactionService;
import com.bank.bankingApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    // Get transactions for a user
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@RequestParam Long userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
        if (transactions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(transactions);
        }
        return ResponseEntity.ok(transactions);
    }

    // Get the balance for a user by summing all transactions
    @GetMapping("/user-balance")
    public ResponseEntity<Double> getUserBalance(@RequestParam Long userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
        double balance = 0;
        for (Transaction transaction : transactions) {
            if (transaction.getType().equalsIgnoreCase("deposit")) {
                balance += transaction.getAmount();
            } else if (transaction.getType().equalsIgnoreCase("withdrawal")) {
                balance -= transaction.getAmount();
            }
        }
        return ResponseEntity.ok(balance);
    }

    // Add a new transaction
    @PostMapping("/add-transaction")
    public ResponseEntity<?> addTransaction(@RequestBody Transaction transaction, @RequestParam Long userId) {
        // Ensure the transaction date is set in the service
        Transaction newTransaction = transactionService.addTransaction(transaction, userId);

        if (newTransaction != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(newTransaction);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error adding transaction.");
    }
}

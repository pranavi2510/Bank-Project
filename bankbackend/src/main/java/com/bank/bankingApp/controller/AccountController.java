package com.bank.bankingApp.controller;

import com.bank.bankingApp.model.Account;
import com.bank.bankingApp.model.StatusRequest;
import com.bank.bankingApp.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Get all accounts for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAccountsByUser(@PathVariable Long userId) {
        List<Account> accounts = accountService.getAccountsByUser(userId);
        if (!accounts.isEmpty()) {
            return ResponseEntity.ok(accounts);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No accounts found for this user.");
        }
    }

    // Get account by accountId
    @GetMapping("/{accountId}")
    public ResponseEntity<?> getAccountById(@PathVariable Long accountId) {
        Optional<Account> account = accountService.getAccountById(accountId);
        if (account.isPresent()) {
            return ResponseEntity.ok(account.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
        }
    }

    // Create a new account
    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        Account createdAccount = accountService.createAccount(account);
        return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
    }

    // Update account balance
    @PutMapping("/{accountId}/balance")
    public ResponseEntity<?> updateAccountBalance(@PathVariable Long accountId, @RequestParam Double newBalance) {
        Account updatedAccount = accountService.updateAccountBalance(accountId, newBalance);
        if (updatedAccount != null) {
            return ResponseEntity.ok(updatedAccount);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
        }
    }

    @PutMapping("/{accountId}/status")
    public ResponseEntity<?> updateAccountStatus(@PathVariable Long accountId, @RequestBody StatusRequest statusRequest) {
        Account updatedAccount = accountService.updateAccountStatus(accountId, statusRequest.getStatus());
        if (updatedAccount != null) {
            return ResponseEntity.ok(updatedAccount);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
        }
    }

    // Delete account by accountId
    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long accountId) {
        boolean isDeleted = accountService.deleteAccount(accountId);
        if (isDeleted) {
            return ResponseEntity.ok("Account successfully deleted.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
        }
    }
}

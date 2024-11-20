package com.bank.bankingApp.service;

import com.bank.bankingApp.model.Account;
import com.bank.bankingApp.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    // Get all accounts for a user
    public List<Account> getAccountsByUser(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    // Get account by accountId
    public Optional<Account> getAccountById(Long accountId) {
        return accountRepository.findById(accountId);
    }

    // Create a new account
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    // Update account balance
    public Account updateAccountBalance(Long accountId, Double newBalance) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            account.setBalance(newBalance);
            return accountRepository.save(account);
        }
        return null;
    }

    // Update account status
    public Account updateAccountStatus(Long accountId, String status) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            account.setStatus(status);
            return accountRepository.save(account);
        }
        return null;
    }

    // Delete account
    public boolean deleteAccount(Long accountId) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isPresent()) {
            accountRepository.deleteById(accountId);
            return true;
        }
        return false;
    }
}

package com.bank.bankingApp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Automatically generate the ID
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String type;  // deposit or withdrawal

    private String details;

    @Column(nullable = false)
    private LocalDateTime transactionDate;  // Automatically set to the current date/time

    @ManyToOne  // Create the relationship with the User entity
    @JoinColumn(name = "user_id", nullable = false)  // Foreign key column in Transaction table
    private User user;  // Link to the User entity

    // Default constructor
    public Transaction() {
        this.transactionDate = LocalDateTime.now(); // Automatically set transaction date to current date and time
    }

    // Constructor with required fields
    public Transaction(Double amount, String type, String details, User user) {
        this.amount = amount;
        this.type = type;
        this.details = details;
        this.transactionDate = LocalDateTime.now(); // Automatically set transaction date to current date and time
        this.user = user;  // Link the transaction to the user
    }

    // Getter and Setter for ID
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter and Setter for amount
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    // Getter and Setter for type (deposit/withdrawal)
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    // Getter and Setter for details
    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    // Getter and Setter for transaction date
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    // Getter and Setter for user
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

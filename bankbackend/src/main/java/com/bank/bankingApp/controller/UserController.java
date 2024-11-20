package com.bank.bankingApp.controller;

import com.bank.bankingApp.model.Transaction;
import com.bank.bankingApp.model.User;
import com.bank.bankingApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // Register User
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    // Login User
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        // Manually check the credentials
        Optional<User> foundUser = userService.loginUser(user.getEmail(), user.getPassword());
        if (foundUser.isPresent()) {
            return ResponseEntity.ok(foundUser.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    // Get User Details (by Email)
    @GetMapping("/user-details")
    public ResponseEntity<?> getUserDetails(@RequestParam String email) {
        // Fetch user data based on email
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get()); // Returns user info
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }





}

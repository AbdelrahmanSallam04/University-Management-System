package com.university.backend.controller;

import com.university.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // GET all accounts
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAccounts() {
        try {
            Map<String, Object> result = accountService.getAllAccounts();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error fetching accounts: " + e.getMessage()
            ));
        }
    }

    // POST create account
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createAccount(@RequestBody Map<String, String> userData) {
        try {
            Map<String, Object> result = accountService.createUserAccount(
                    userData.get("firstName"),
                    userData.get("lastName"),
                    userData.get("email"),
                    userData.get("role"),
                    userData.get("password"),
                    userData.get("phone"),
                    userData.get("department")
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()
            ));
        }
    }

    // PUT update account
    // PUT update account
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateAccount(
            @PathVariable("id") Integer id,  // Explicitly specify the path variable name
            @RequestBody Map<String, String> userData) {
        try {
            System.out.println("Updating account with ID: " + id); // Debug log

            Map<String, Object> result = accountService.updateUserAccount(
                    id,
                    userData.get("firstName"),
                    userData.get("lastName"),
                    userData.get("email"),
                    userData.get("role"),
                    userData.get("password"),
                    userData.get("phone"),
                    userData.get("department")
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error updating account: " + e.getMessage()
            ));
        }
    }

    // DELETE account
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAccount(@PathVariable("id") Integer id) {
        try {
            System.out.println("Deleting account with ID: " + id); // Debug log

            Map<String, Object> result = accountService.deleteUserAccount(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error deleting account: " + e.getMessage()
            ));
        }
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ Account controller is working with CRUD operations!");
    }
}
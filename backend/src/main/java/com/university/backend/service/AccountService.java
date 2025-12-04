package com.university.backend.service;

import com.university.backend.model.Account;
import com.university.backend.model.AccountType;
import com.university.backend.repository.AccountRepository;
import com.university.backend.repository.AccountTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountTypeRepository accountTypeRepository;

    public Map<String, Object> createUserAccount(String firstName, String lastName, String email,
                                                 String role, String password, String phone, String department) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("=== DEBUG: Starting account creation ===");
            System.out.println("Role received: " + role);

            // Check if email already exists
            if (accountRepository.existsByEmail(email)) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return response;
            }

            // HARDCODED MAPPING: Role to account_type ID
            Integer accountTypeId = getAccountTypeIdByRole(role);
            System.out.println("Mapped role '" + role + "' to accountTypeId: " + accountTypeId);

            if (accountTypeId == null) {
                response.put("success", false);
                response.put("message", "Invalid role: " + role);
                return response;
            }

            // Get the AccountType by ID
            AccountType accountType = accountTypeRepository.findById(accountTypeId)
                    .orElseThrow(() -> new RuntimeException("Account type not found for ID: " + accountTypeId));

            System.out.println("Found AccountType - ID: " + accountType.getId() + ", Name: " + accountType.getName());

            // Create account with ALL database columns
            Account account = new Account();
            account.setFirstName(firstName);
            account.setLastName(lastName);
            account.setEmail(email);
            account.setPassword(password);
            account.setAccountType(accountType);
            account.setPhone(phone != null ? phone : "");
            account.setDepartment(department != null ? department : "General");
            account.setCreatedAt(LocalDateTime.now());
            account.setIsActive(true);
            account.setLastLogin(null);

            System.out.println("Account object created with account_type_id: " + account.getAccountType().getId());

            Account savedAccount = accountRepository.save(account);

            System.out.println("=== DEBUG: Account saved successfully ===");
            System.out.println("Saved account ID: " + savedAccount.getId());

            response.put("success", true);
            response.put("message", "Account created successfully!");
            response.put("accountId", savedAccount.getId());
            response.put("user", Map.of(
                    "firstName", savedAccount.getFirstName(),
                    "lastName", savedAccount.getLastName(),
                    "email", savedAccount.getEmail(),
                    "role", savedAccount.getAccountType().getName(),
                    "department", savedAccount.getDepartment()
            ));

        } catch (Exception e) {
            System.out.println("=== DEBUG: Error occurred ===");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error creating account: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> updateUserAccount(int id, String firstName, String lastName,
                                                 String email, String role, String password,
                                                 String phone, String department) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("=== DEBUG: Starting account update ===");
            System.out.println("Updating account ID: " + id);

            // Find the existing account
            Optional<Account> existingAccountOpt = accountRepository.findById(id);
            if (existingAccountOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Account not found with ID: " + id);
                return response;
            }

            Account existingAccount = existingAccountOpt.get();

            // Check if email is being changed and if new email already exists
            if (!existingAccount.getEmail().equals(email) && accountRepository.existsByEmail(email)) {
                response.put("success", false);
                response.put("message", "Email already exists: " + email);
                return response;
            }

            // Update account type if role changed
            if (role != null && !role.isEmpty()) {
                Integer accountTypeId = getAccountTypeIdByRole(role);
                if (accountTypeId == null) {
                    response.put("success", false);
                    response.put("message", "Invalid role: " + role);
                    return response;
                }

                AccountType accountType = accountTypeRepository.findById(accountTypeId)
                        .orElseThrow(() -> new RuntimeException("Account type not found for ID: " + accountTypeId));
                existingAccount.setAccountType(accountType);
            }

            // Update other fields
            if (firstName != null) existingAccount.setFirstName(firstName);
            if (lastName != null) existingAccount.setLastName(lastName);
            if (email != null) existingAccount.setEmail(email);
            if (password != null && !password.isEmpty()) existingAccount.setPassword(password);
            if (phone != null) existingAccount.setPhone(phone);
            if (department != null) existingAccount.setDepartment(department);

            Account updatedAccount = accountRepository.save(existingAccount);

            System.out.println("=== DEBUG: Account updated successfully ===");

            response.put("success", true);
            response.put("message", "Account updated successfully!");
            response.put("accountId", updatedAccount.getId());
            response.put("user", Map.of(
                    "firstName", updatedAccount.getFirstName(),
                    "lastName", updatedAccount.getLastName(),
                    "email", updatedAccount.getEmail(),
                    "role", updatedAccount.getAccountType().getName(),
                    "department", updatedAccount.getDepartment()
            ));

        } catch (Exception e) {
            System.out.println("=== DEBUG: Error updating account ===");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error updating account: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> deleteUserAccount(Integer id) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("=== DEBUG: Starting account deletion ===");
            System.out.println("Deleting account ID: " + id);

            // Check if account exists
            if (!accountRepository.existsById(id)) {
                response.put("success", false);
                response.put("message", "Account not found with ID: " + id);
                return response;
            }

            // Delete the account
            accountRepository.deleteById(id);

            System.out.println("=== DEBUG: Account deleted successfully ===");

            response.put("success", true);
            response.put("message", "Account deleted successfully!");
            response.put("deletedAccountId", id);

        } catch (Exception e) {
            System.out.println("=== DEBUG: Error deleting account ===");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error deleting account: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getAllAccounts() {
        Map<String, Object> response = new HashMap<>();
        try {
            var accounts = accountRepository.findAll();
            response.put("success", true);
            response.put("accounts", accounts);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching accounts: " + e.getMessage());
        }
        return response;
    }

    // HARDCODED MAPPING - Role to account_type ID
    private Integer getAccountTypeIdByRole(String role) {
        switch (role) {
            case "ADMIN":
                return 1;
            case "PROFESSOR":
                return 2;
            case "STUDENT":
                return 3;
            case "PARENT":
                return 4;
            default:
                return null;
        }
    }
}
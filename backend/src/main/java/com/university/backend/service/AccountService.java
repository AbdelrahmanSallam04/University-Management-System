package com.university.backend.service;

import com.university.backend.model.*;
import com.university.backend.repository.*;
import jakarta.transaction.Transactional;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private DepartmentRepository departmentRepository;

//    @Autowired
//    private AdminRepository adminRepository;
//
//    @Autowired
//    private TARepository taRepository;

    @Transactional // Important: Ensures Account and User are created together or rolled back
    public Map<String, Object> createUserAccount(String firstName, String lastName, String email,
                                                 String role, String password, String phone, String departmentName) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Check if email exists
            if (accountRepository.existsByEmail(email)) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return response;
            }

            // 2. Resolve Account Type
            Integer accountTypeId = getAccountTypeIdByRole(role);
            if (accountTypeId == null) {
                response.put("success", false);
                response.put("message", "Invalid role: " + role);
                return response;
            }

            Department department = departmentRepository.findByDepartmentName(departmentName);
            if (department == null)
            {
                response.put("success", false);
                response.put("message", "Department does not exist" + departmentName);
                return response;
            }

            AccountType accountType = accountTypeRepository.findById(accountTypeId)
                    .orElseThrow(() -> new RuntimeException("Account type not found"));

            // 3. Create and Save the ACCOUNT (Authentication details only)
            Account account = new Account();
            account.setEmail(email);
            account.setPassword(password); // Ensure this is hashed in production!
            account.setAccountType(accountType);
            account.setDepartment(department);
            account.setCreatedAt(LocalDateTime.now());
            account.setIsActive(true);

            Account savedAccount = accountRepository.save(account);

            // 4. Create the specific USER subclass based on role
            User newUser;

            switch (role.toLowerCase()) {
                case "student":
                    Student student = new Student();
                    student.setDepartment(department);
                    newUser = student;
                    break;

                case "professor": // Renamed from staff as requested
                case "staff":
                    Professor professor = new Professor();
                    professor.setSalary(0.0); // Mandatory field in StaffMember, setting default
                    // Note: Professor also has a 'Department' entity field.
                    // You need to fetch the Department entity and set it here eventually.
                    newUser = professor;
                    break;

                case "admin":
                    Admin admin = new Admin();
                    newUser = admin;
                    break;

                case "assistant": // Assuming this is TA
                case "ta":
                    TA ta = new TA();
                    ta.setSalary(0.0);
                    newUser = ta;
                    break;

                default:
                    throw new RuntimeException("Logic not implemented for role: " + role);
            }

            // 5. Set Common User Fields and Link to Account
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setPhone(phone);
            newUser.setAccount(savedAccount); // <--- LINKING HAPPENS HERE

            // 6. Save the User using the generic repository (Hibernate handles the subclass table insertion)
            userRepository.save(newUser);

            response.put("success", true);
            response.put("message", "Account and User profile created successfully!");
            response.put("accountId", savedAccount.getId());
            response.put("userId", newUser.getUserId());

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            // Transaction triggers rollback automatically here
            throw new RuntimeException(e);
        }

        return response;
    }

    @Transactional
    public Map<String, Object> updateUserAccount(Integer accountId, String firstName, String lastName,
                                                 String email, String role, String password,
                                                 String phone, String departmentName) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Fetch Account
            Optional<Account> accountOpt = accountRepository.findById(Long.valueOf(accountId));
            if (accountOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Account not found");
                return response;
            }
            Account account = accountOpt.get();

            // 2. Fetch Associated User
            // We need to find the User that owns this account to update names/phone
            Optional<User> userOpt = Optional.ofNullable(userRepository.findUserByAccountId(accountId));
            if (userOpt.isEmpty()) {
                // Edge case: Account exists but User doesn't?
                response.put("success", false);
                response.put("message", "User profile not found for this account");
                return response;
            }

            Department department = departmentRepository.findByDepartmentName(departmentName);
            if (department == null)
            {
                response.put("success", false);
                response.put("message", "Department does not exist" + departmentName);
                return response;
            }
            User user = userOpt.get();

            // 3. Update Account Details (Auth info)
            if (email != null && !email.isEmpty()) account.setEmail(email);
            if (password != null && !password.isEmpty()) account.setPassword(password);
            account.setDepartment(department);

            // Update Role (AccountType) - Careful, this doesn't change the User Subclass (Table)
            // Changing a Student to a Professor requires deleting the Student entity and creating a Professor entity.
            // For now, we only update the auth role reference.
            if (role != null) {
                Integer typeId = getAccountTypeIdByRole(role);
                if(typeId != null) {
                    AccountType at = accountTypeRepository.findById(typeId).orElse(null);
                    if(at != null) account.setAccountType(at);
                }
            }

            // 4. Update User Details (Personal info)
            if (firstName != null) user.setFirstName(firstName);
            if (lastName != null) user.setLastName(lastName);
            if (phone != null) user.setPhone(phone);

            // 5. Save Both
            accountRepository.save(account);
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Account updated successfully");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating: " + e.getMessage());
        }

        return response;
    }

    @Transactional
    public Map<String, Object> deleteUserAccount(Integer accountId) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (!accountRepository.existsById(Long.valueOf(accountId))) {
                response.put("success", false);
                response.put("message", "Account not found");
                return response;
            }

            // 1. Delete the User first
            // Because User has the ForeignKey (account_id), we must remove User first
            // or we get a Foreign Key Constraint violation.
            userRepository.deleteByAccountId(accountId);

            // 2. Delete the Account
            accountRepository.deleteById(Long.valueOf(accountId));

            response.put("success", true);
            response.put("message", "Account and User deleted successfully");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getAllAccounts() {
        Map<String, Object> response = new HashMap<>();
        // Note: You might want to return Users instead of Accounts to get names
        response.put("success", true);
        response.put("accounts", accountRepository.findAll());
        return response;
    }

    private Integer getAccountTypeIdByRole(String role) {
        if (role == null) return null;
        switch (role.toLowerCase()) {
            case "student": return 1;
            case "professor": return 2; // Fixed mapping
            case "staff": return 2;     // Legacy support
            case "admin": return 3;
            case "assistant": return 4;
            case "parent": return 5;
            default: return null;
        }
    }
}
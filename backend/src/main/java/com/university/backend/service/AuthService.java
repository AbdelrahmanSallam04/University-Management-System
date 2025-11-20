package com.university.backend.service;
import com.university.backend.model.Account;
import com.university.backend.repository.AccountRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AccountRepository accountRepository;

    // Use constructor injection for the repository
    public AuthService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public boolean authenticate(String username, String password) {
        // Find account by username
        Account account = accountRepository.findByEmail(username);

        // Check if account exists and password matches
        if (account != null && account.getPassword().equals(password)) {
            return true;
        }
        return false;
    }

    public String getUserRole(String username)
    {
        Account account = accountRepository.findByEmail(username);
        if (account != null && account.getAccountType() != null)
        {
            return account.getAccountType().getName();
        }
        return null;
    }
}
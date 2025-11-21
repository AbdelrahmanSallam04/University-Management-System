package com.university.backend.service;
import com.university.backend.model.Account;
import com.university.backend.model.User;
import com.university.backend.repository.AccountRepository;
import com.university.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // Use constructor injection for the repository
    public AuthService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
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

    public String getAccountID(String username) {
        Account account = accountRepository.findByEmail(username);
        if (account != null && account.getAccountType() != null) {
            return account.getId().toString();
        }
        return null;
    }

    public String getUserID(String accountID)
    {
        User user = userRepository.findUserByAccountId(Integer.parseInt(accountID));
        if (user != null && user.getUserId() != null)
        {
            return user.getUserId().toString();
        }
        return null;
    }
}
package com.university.backend.controller;
import com.university.backend.dto.LoginRequest;
import com.university.backend.dto.LoginResponse;
import com.university.backend.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpSession session)
    {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // TODO: Check if username and password are correct
        boolean isValid = authService.authenticate(username, password);

        if (isValid) {
            String userRole = authService.getUserRole(username);
            int accountID = authService.getAccountID(username);
            int userID = authService.getUserID(accountID);


            session.setAttribute("user", username);
            session.setAttribute("userRole", userRole);
            session.setAttribute("accountID", accountID);
            session.setAttribute("userID", userID);

            System.out.println("Login successful! User: " + username + ", Role: " + userRole + ", Account ID: " + accountID + ", User ID: " + userID);
            System.out.println(session.getAttribute("userID"));
            return ResponseEntity.ok(new LoginResponse("Login successful", userRole));
        } else {
            System.out.println("Login Failed!");
            return ResponseEntity.status(401).body(new LoginResponse("Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout(HttpSession session) {
        String user = (String) session.getAttribute("user");
        System.out.println("Logging out user: " + user);

        session.invalidate(); // Destroy the session
        return ResponseEntity.ok(new LoginResponse("Logged out successfully"));
    }

    // Simple credential check (you'll replace this later)
    private boolean checkCredentials(String username, String password) {
        // For now, just check against hardcoded values
        return "admin".equals(username) && "password".equals(password);
    }
}

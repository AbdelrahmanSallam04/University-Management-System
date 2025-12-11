import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ADD THIS IMPORT
import InputField from '../components/InputField';
import authService from '../services/authService';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ← ADD THIS HOOK

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await authService.login(username, password);
            console.log('Login successful:', result);
            // Navigate based on user role
            if (result.role === "PROFESSOR") {
                navigate('/professor-dashboard');
            } else if (result.role === "ADMIN") {
                navigate('/admin-dashboard');
            } else if (result.role === "STUDENT") {
                navigate('/student-dashboard');
                   } else if (result.role === "PARENT") {
                                navigate('/parent-dashboard');

            } else {
                console.log('Role unidentified!!', result)
            }
            // onLogin(); // Notify App component
        } catch (error) {
            const errorMessage =
                'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>UniPortal</h1>
                <p>University Management System</p>
            </div>

            <div className="login-content">
                <div className="login-card">
                    <h2>Welcome Back</h2>

                    {/* Error Message Display */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <InputField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            error={error && !username.trim() ? 'Username is required' : ''}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            error={error && !password.trim() ? 'Password is required' : ''}
                        />

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
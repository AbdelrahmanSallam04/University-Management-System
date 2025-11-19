import React, { useState } from 'react';
import InputField from '../components/InputField';
import authService from '../services/authService';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.login(username, password);
            onLogin(); // Notify App component
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            setError(error.message);
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
                    <form onSubmit={handleLogin} className="login-form">
                        <InputField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />

                        <button type="submit" className="login-btn">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
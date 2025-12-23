import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import authService from '../services/authService';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await authService.login(username, password);
            if (result.role === "PROFESSOR") {
                navigate('/professor-dashboard');
            } else if (result.role === "ADMIN") {
                navigate('/admin-dashboard');
            } else if (result.role === "STUDENT") {
                navigate('/student-dashboard');
            } else if (result.role === "PARENT") {
                navigate('/parent-dashboard');
            } else {
                console.log('Role unidentified!!', result);
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
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

            <div className="login-content-centered">
                <div className="login-card-centered">
                    <h2>Welcome Back</h2>

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
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />

                        <div className="button-group">
                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <button
                                type="button"
                                className="public-news-btn"
                                onClick={() => window.open('/public-announcements', '_blank')}
                            >
                                📢 News
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
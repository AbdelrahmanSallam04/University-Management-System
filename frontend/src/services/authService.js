import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const authService = {
    login: async (username, password) => {
        try {
            console.log('Sending login request to:', `${API_BASE_URL}/auth/login`);
            console.log('Credentials:', { username, password });

            // withCredentials: true is REQUIRED for session-based auth
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username: username,
                password: password
            }, {
                withCredentials: true
            });

            console.log('Login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    // Also add checkAuth to verify sessions work
    checkAuth: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/check`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw new Error('Not authenticated');
        }
    }
};

export default authService;
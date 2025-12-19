import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/maintenance';

export const submitReport = async (reportData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/report`, reportData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting maintenance report:", error);
        throw error;
    }
};

export const fetchAllReports = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching maintenance reports:", error);
        throw error;
    }
};

export const updateStatus = async (statusData) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/update-status`, statusData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

export const updatePriority = async (priorityData) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/update-priority`, priorityData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error updating priority:", error);
        throw error;
    }

};



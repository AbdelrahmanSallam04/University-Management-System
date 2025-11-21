// frontend/src/services/roomService.js

import axios from 'axios';

// Define the base URL for your backend API (update this to your actual backend port/URL)
const API_BASE_URL = 'http://localhost:8080/api/rooms';

export const fetchAvailableRooms = async (date, roomType) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/availability`, {
            params: {
                date: date,
                roomType: roomType, // This parameter will be used by your backend to filter
            },
        });
        // The response.data should contain the list of available rooms
        return response.data;
    } catch (error) {
        console.error("Error fetching room availability:", error);
        // Important: Rethrow the error so the component can handle it
        throw error;
    }
};
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
            withCredentials: true
        });
        // The response.data should contain the list of available rooms
        return response.data;
    } catch (error) {
        console.error("Error fetching room availability:", error);
        // Important: Rethrow the error so the component can handle it
        throw error;
    }
};

export const bookRoom = async (bookingData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/book`, bookingData, {
            withCredentials: true // <--- CRITICAL FIX 2: Send cookies to backend
        });
        return response.data;
    } catch (error) {
        console.error("Error booking room:", error);
        throw error;
    }
};


export const fetchUserBookings = async () => {
    try {
        // This hits the secure endpoint which derives user ID from the session cookie
        const response = await axios.get(`${API_BASE_URL}/bookings/my`, {
            withCredentials: true
        });
        // Returns the list of BookingResponseDTOs
        return response.data;
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        throw error;
    }
};


// roomService.js - FIX
export const fetchAllRooms = async () => {
    try {
        // MUST be .get to match @GetMapping in RoomController.java
        const response = await axios.get(`${API_BASE_URL}/all`, {
            withCredentials: true // Config must be the 2nd argument for GET
        });
        console.log("Data from server:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all rooms:", error);
        throw error;
    }
};
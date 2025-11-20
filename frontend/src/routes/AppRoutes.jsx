// src/routes/AppRoutes.jsx

// 1. Import the new component
import React from "react";
import { Routes, Route } from "react-router-dom";
import RoomCalendar from '../pages/RoomCalendar.jsx';
// ... other imports (StudentDashboard, etc.)

const AppRoutes = () => {
    return (
            <Routes>

                <Route path="/" element={<RoomCalendar />} />

            </Routes>
    );
};

export default AppRoutes;
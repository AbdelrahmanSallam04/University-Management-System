// src/components/EnrolledCourses.jsx

import React, { useState, useEffect } from "react";
import "../styles/EnrolledCourses.css";

// Ensure this component name matches your export/file name (EnrolledCourses.jsx)
const EnrolledCoursesView = () => {

    // 🛑 FIX: Define the state variables and their setters using array destructuring
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Logic ---
    const fetchEnrolledCourses = async () => {
        // ... (API fetch implementation using try/catch/finally) ...

        // Placeholder for successful test (REMOVED DUMMY DATA FOR CLEANLINESS):
        try {
            // Using your actual API call now
            const response = await fetch('/api/v1/students/me/courses');

            if (!response.ok) {
                // If status is 404, 500, etc.
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // FIX: setCourses is now defined
            setCourses(data);

        } catch (err) {
            console.error("Failed to fetch courses:", err);
            // FIX: setError is now defined
            setError("Could not load courses. Ensure API is running and accessible.");
        } finally {
            // FIX: setIsLoading is now defined
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    // --- Conditional Content Rendering ---
    let content;
    // FIX: isLoading, error, and courses are now defined
    if (isLoading) {
        content = <p>Loading your enrolled courses... ⏳</p>;
    } else if (error) {
        content = <p style={{ color: 'red' }}>Error: {error}</p>;
    } else if (courses.length === 0) {
        content = <p>You are not currently enrolled in any courses.</p>;
    } else {
        content = (
            <table className="courses-table">
                {/* ... table content remains the same ... */}
            </table>
        );
    }

    // --- Layout Structure ---
    return (
        <div className="dashboard-wrapper">
            {/* ... layout structure remains the same ... */}
            <div className="main-content">
                {/* ... */}
                <div className="content-section">
                    <h1>📚 My Enrolled Courses</h1>
                    <div className="data-container">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursesView;
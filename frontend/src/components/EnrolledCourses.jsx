// src/components/EnrolledCourses.jsx

import React, { useState, useEffect } from "react";
import "../styles/EnrolledCourses.css";

const EnrolledCoursesView = () => {

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Logic ---
    const fetchEnrolledCourses = async () => {
        try {
            // Using your actual API call now
            const response = await fetch('/api/v1/students/me/courses');

            if (!response.ok) {
                // If status is 404, 500, etc.
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCourses(data);

        } catch (err) {
            console.error("Failed to fetch courses:", err);
            setError("Could not load courses. Ensure API is running and accessible.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    // --- Conditional Content Rendering ---
    let content;

    if (isLoading) {
        content = <p>Loading your enrolled courses... ⏳</p>;
    } else if (error) {
        content = <p style={{ color: 'red' }}>Error: {error}</p>;
    } else if (courses.length === 0) {
        content = <p>You are not currently enrolled in any courses.</p>;
    } else {
        // VITAL FIX: Complete the table structure using the DTO keys
        content = (
            <table className="courses-table">
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Type</th>
                    <th>Professor</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {/* Map over the DTO array received from the backend */}
                {courses.map((course) => (
                    <tr key={course.courseId}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.creditHours}</td>
                        <td>{course.courseTypeName}</td> {/* Mapped from DTO */}
                        <td>{course.professorFullName}</td> {/* Mapped from DTO */}
                        <td>
                            <button
                                className="view-details-btn"
                                onClick={() => alert(`Viewing details for: ${course.name}`)}
                            >
                                View Details
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    // --- Layout Structure ---
    return (
        <div className="dashboard-wrapper">
            {/* The rest of your wrapper and layout is fine */}
            <div className="main-content">
                <div className="content-section">
                    <h1>📚 My Enrolled Courses</h1>
                    <div className="data-container">
                        {content} {/* This will render the table or loading/error message */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursesView;
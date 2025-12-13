// src/components/EnrolledCourses.jsx

import React, { useState, useEffect } from "react";
import Sidebar from "./StudentSidebar";
import "../styles/EnrolledCourses.css";
import "../styles/StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnrolledCoursesView = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/v1/students/me/courses",
                { withCredentials: true } // 🔑 include session cookies
            );
            setCourses(response.data);
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

    let content;
    if (isLoading) {
        content = <p>Loading your enrolled courses... ⏳</p>;
    } else if (error) {
        content = <p style={{ color: "red" }}>Error: {error}</p>;
    } else if (courses.length === 0) {
        content = <p>You are not currently enrolled in any courses.</p>;
    } else {
        content = (
            <table className="courses-table">
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Type</th>
                    <th>Professor</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {courses.map((course) => (
                    <tr key={course.courseId}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.creditHours}</td>
                        <td>{course.courseTypeName}</td>
                        <td>{course.professorFullName}</td>
                        <td>
                            <button
                                className="view-details-btn"
                                onClick={() => navigate(`/course/${course.courseId}/assignments`)}
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

    return (
        <div className="dashboard-wrapper">
            <Sidebar /> {/* ✅ Show sidebar like in dashboard */}
            <div className="main-content">
                <div className="content-section">
                    <h1>📚 My Enrolled Courses</h1>
                    <div className="data-container">{content}</div>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursesView;

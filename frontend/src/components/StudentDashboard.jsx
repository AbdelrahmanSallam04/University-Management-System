import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./StudentSidebar";
import "../styles/StudentDashboard.css";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with actual student user ID from your authentication system

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
          `http://localhost:8080/api/student/dashboard`,
          {
            withCredentials: true  // This is crucial for sending cookies/session
          }
      );
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const dashboardCards = [
    { id: 1, name: "Courses", icon: "📚", path: "/EnrolledCourses", color: "#f5576c" },
    { id: 2, name: "Courses Catalog", icon: "📊", path: "/course-catalog", color: "#667eea" },
    { id: 3, name: "Exams", icon: "📝", path: "/exams", color: "#4facfe" },
    { id: 4, name: "Profile", icon: "👤", path: "/profile", color: "#43e97b" },
    { id: 6, name: "Staff Directories", icon: "👨‍🏫", path: "/StaffDirectories", color: "#a8edea" },
    { id: 8, name: "Events", icon: "💬", path: "/Events", color: "#89f7fe" },
  ];

  const handleCardClick = (card) => {
    setActiveCard(card.id);
    setTimeout(() => {
      navigate(card.path);
      setActiveCard(null);
    }, 200);
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="error-section">
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        {/* Welcome Section - Dynamic Data */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back, {dashboardData?.firstName || 'Student'}! 👋</h1>
             <p style={{ color: 'white' }}>Here's your academic overview for today</p>
          </div>
          <div className="date-display">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Quick Stats - Dynamic Data */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{dashboardData?.enrolledCoursesCount || 0}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>3</h3>
              <p>Pending Assignments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>3.8</h3>
              <p>Current GPA</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div className="cards-section">
          <h2>Quick Access</h2>
          <div className="cards-container">
            {dashboardCards.map((card) => (
              <div
                key={card.id}
                className={`dashboard-card ${activeCard === card.id ? 'active' : ''}`}
                onClick={() => handleCardClick(card)}
                style={{ '--card-color': card.color }}
              >
                <div className="card-icon">{card.icon}</div>
                <div className="card-title">{card.name}</div>
                <div className="card-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Upcoming Events */}
        <div className="events-section">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            <div className="event-item">
              <div className="event-date">
                <span className="event-day">15</span>
                <span className="event-month">NOV</span>
              </div>
              <div className="event-details">
                <h4>Mathematics Midterm</h4>
                <p>10:00 AM - 12:00 PM</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">
                <span className="event-day">18</span>
                <span className="event-month">NOV</span>
              </div>
              <div className="event-details">
                <h4>Computer Science Lab</h4>
                <p>02:00 PM - 04:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
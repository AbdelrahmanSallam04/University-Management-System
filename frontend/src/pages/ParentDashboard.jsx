import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParentSidebar from '../components/ParentSidebar';
import '../styles/ParentDashboard.css';

const ParentDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'children':
        return <MyChildren />;
      case 'assignments':
        return <AssignmentsView />;
      case 'grades':
        return <GradesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'messages':
        return <MessagesView />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="parent-dashboard">
      <ParentSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
      <div className="parent-main-content">
        {renderContent()}
      </div>
    </div>
  );
};

// Simple Content Components
// In your ParentDashboard.jsx, replace the DashboardOverview component:

const DashboardOverview = () => (
  <div>
    <div className="parent-header">
      <h1>Welcome Back, John</h1>
      <p>Here's an overview of your children's academic progress</p>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-icon">👨‍👩‍👧‍👦</span>
          <div className="stat-trend up">+12%</div>
        </div>
        <div className="stat-content">
          <div className="stat-number">2</div>
          <h3>Children Enrolled</h3>
          <div className="stat-subtitle">Active Students</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-icon">📊</span>
          <div className="stat-trend up">+5%</div>
        </div>
        <div className="stat-content">
          <div className="stat-number">86%</div>
          <h3>Average Grade</h3>
          <div className="stat-subtitle">This Semester</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-icon">📝</span>
          <div className="stat-trend down">-2</div>
        </div>
        <div className="stat-content">
          <div className="stat-number">3</div>
          <h3>Pending Assignments</h3>
          <div className="stat-subtitle">Due This Week</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-icon">💬</span>
          <div className="stat-badge">2</div>
        </div>
        <div className="stat-content">
          <div className="stat-number">5</div>
          <h3>Unread Messages</h3>
          <div className="stat-subtitle">From Teachers</div>
        </div>
      </div>
    </div>

    {/* Children Performance Grid */}
    <div className="content-section">
      <div className="section-header">
        <h2>Children's Performance</h2>
        <button className="view-all-btn">View Details →</button>
      </div>

      <div className="children-performance-grid">
        <div className="child-performance-card">
          <div className="child-header">
            <div className="child-avatar">👧</div>
            <div className="child-info">
              <h4>Sarah Johnson</h4>
              <p>10th Grade • Mathematics</p>
            </div>
          </div>
          <div className="performance-stats">
            <div className="performance-stat">
              <span className="stat-label">Current GPA</span>
              <span className="stat-value">3.8</span>
            </div>
            <div className="performance-stat">
              <span className="stat-label">Attendance</span>
              <span className="stat-value">96%</span>
            </div>
            <div className="performance-stat">
              <span className="stat-label">Assignments</span>
              <span className="stat-value">12/15</span>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '92%' }}></div>
            </div>
            <div className="progress-label">
              <span className="progress-text">Overall Progress</span>
              <span className="progress-percent">92%</span>
            </div>
          </div>
        </div>

        <div className="child-performance-card">
          <div className="child-header">
            <div className="child-avatar">👦</div>
            <div className="child-info">
              <h4>Michael Johnson</h4>
              <p>8th Grade • Science</p>
            </div>
          </div>
          <div className="performance-stats">
            <div className="performance-stat">
              <span className="stat-label">Current GPA</span>
              <span className="stat-value">3.5</span>
            </div>
            <div className="performance-stat">
              <span className="stat-label">Attendance</span>
              <span className="stat-value">94%</span>
            </div>
            <div className="performance-stat">
              <span className="stat-label">Assignments</span>
              <span className="stat-value">10/12</span>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '88%' }}></div>
            </div>
            <div className="progress-label">
              <span className="progress-text">Overall Progress</span>
              <span className="progress-percent">88%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Overview Grid */}
    <div className="content-grid">
      <div className="overview-card">
        <div className="overview-header">
          <h3>📅 Upcoming Events</h3>
          <span className="date-range">This Week</span>
        </div>
        <div className="events-list">
          <div className="event-item">
            <div className="event-date">
              <span className="event-day">15</span>
              <span className="event-month">Jan</span>
            </div>
            <div className="event-details">
              <h4>Parent-Teacher Meeting</h4>
              <p>10:00 AM • Sarah's Math Class</p>
            </div>
          </div>
          <div className="event-item">
            <div className="event-date">
              <span className="event-day">18</span>
              <span className="event-month">Jan</span>
            </div>
            <div className="event-details">
              <h4>Science Fair</h4>
              <p>2:00 PM • School Auditorium</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-header">
          <h3>📝 Recent Grades</h3>
          <span className="date-range">Updated Today</span>
        </div>
        <div className="grades-list">
          <div className="grade-item">
            <div className="grade-course">Mathematics</div>
            <div className="grade-content">
              <span className="grade-title">Algebra Quiz</span>
              <span className="grade-score">85/100</span>
            </div>
            <div className="grade-student">Sarah</div>
          </div>
          <div className="grade-item">
            <div className="grade-course">Science</div>
            <div className="grade-content">
              <span className="grade-title">Lab Report</span>
              <span className="grade-score">92/100</span>
            </div>
            <div className="grade-student">Michael</div>
          </div>
          <div className="grade-item">
            <div className="grade-course">English</div>
            <div className="grade-content">
              <span className="grade-title">Essay</span>
              <span className="grade-score">88/100</span>
            </div>
            <div className="grade-student">Sarah</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MyChildren = () => (
  <div className="content-card">
    <h2>My Children</h2>
    <p>View and manage your children's profiles and academic information.</p>
  </div>
);

const AssignmentsView = () => (
  <div className="content-card">
    <h2>Assignments</h2>
    <p>Track assignment submissions, grades, and deadlines.</p>
  </div>
);

const GradesView = () => (
  <div className="content-card">
    <h2>Grades</h2>
    <p>View exam results and overall academic performance.</p>
  </div>
);

const AttendanceView = () => (
  <div className="content-card">
    <h2>Attendance</h2>
    <p>Monitor daily attendance and class participation.</p>
  </div>
);

const MessagesView = () => (
  <div className="content-card">
    <h2>Messages</h2>
    <p>Communicate with teachers and school administrators.</p>
  </div>
);

const CalendarView = () => (
  <div className="content-card">
    <h2>Calendar</h2>
    <p>View school events, holidays, and important dates.</p>
  </div>
);

const SettingsView = () => (
  <div className="content-card">
    <h2>Settings</h2>
    <p>Manage your account preferences and notifications.</p>
  </div>
);

export default ParentDashboard;
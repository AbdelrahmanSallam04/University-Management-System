import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Professor SideBar';
import '../styles/ProfessorDashboard.css';
function TADashboard() {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('dashboard');

    // Mock TA data (you'll replace this with actual data fetching if needed)
    const taData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'ta@university.edu',
        department: 'Computer Science',
        assignedCourses: 3,
        officeHours: 2
    };

    const handleLogout = () => {
        navigate('/login', { replace: true });
    };

    const handleSidebarNavigation = (viewId) => {
        setCurrentView(viewId);
    };

    // Simple view renderer
    const renderMainContent = () => {
        switch (currentView) {
            case 'dashboard':
                return (
                    <>
                        <div className="welcome-section">
                            <div className="welcome-text">
                                <h1>Welcome, TA {taData.firstName} {taData.lastName}!</h1>
                                <p>Teaching Assistant Dashboard</p>
                            </div>
                            <div className="date-display">
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        <div className="stats-container">
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-purple">📚</div>
                                <div className="stat-info">
                                    <h3>{taData.assignedCourses}</h3>
                                    <p>Assigned Courses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-blue">⏰</div>
                                <div className="stat-info">
                                    <h3>{taData.officeHours}</h3>
                                    <p>Office Hours</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-green">🏛️</div>
                                <div className="stat-info">
                                    <h3>{taData.department}</h3>
                                    <p>Department</p>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid-row">
                            <div className="info-card profile-card">
                                <div className="card-header"><h3>👨‍🏫 TA Details</h3></div>
                                <div className="card-body">
                                    <div className="profile-row">
                                        <div className="profile-icon-box">📧</div>
                                        <div className="profile-detail">
                                            <span className="label">Email</span>
                                            <span className="value">{taData.email}</span>
                                        </div>
                                    </div>
                                    <div className="profile-row">
                                        <div className="profile-icon-box">🏛️</div>
                                        <div className="profile-detail">
                                            <span className="label">Department</span>
                                            <span className="value badge">{taData.department}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="info-card tips-card">
                                <div className="card-header"><h3>💡 Quick Actions</h3></div>
                                <div className="card-body">
                                    <ul className="tips-list">
                                        <li><strong>View Courses:</strong> Check assigned courses</li>
                                        <li><strong>Grade Assignments:</strong> Grade student submissions</li>
                                        <li><strong>Set Office Hours:</strong> Manage your availability</li>
                                        <li><strong>Book Rooms:</strong> Reserve rooms for sessions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'courses':
                return (
                    <div className="events-section">
                        <h2>📚 My Assigned Courses</h2>
                        <div className="list-container">
                            <p style={{ textAlign: 'center', padding: '40px' }}>
                                Course listing functionality would go here
                            </p>
                        </div>
                    </div>
                );

            case 'publish_content':
                return (
                    <div className="events-section">
                        <div className="page-header"><h2>📝 Publish Assignment</h2></div>
                        <div className="publish-form-wrapper">
                            <p style={{ textAlign: 'center', padding: '40px' }}>
                                Assignment publishing functionality would go here
                            </p>
                        </div>
                    </div>
                );

            case 'grading':
                return (
                    <div className="events-section">
                        <h2>📊 Grading</h2>
                        <div className="list-container">
                            <p style={{ textAlign: 'center', padding: '40px' }}>
                                Grading functionality would go here
                            </p>
                        </div>
                    </div>
                );

            case 'room_availability':
                return (
                    <div className="calendar-page-container">
                        <div className="page-header">
                            <h2>🗓️ Room Booking</h2>
                        </div>
                        <p style={{ textAlign: 'center', padding: '40px' }}>
                            Room booking functionality would go here
                        </p>
                    </div>
                );

            case 'office_hours':
                return (
                    <div className="events-section">
                        <div className="page-header">
                            <h2>⏰ Office Hours</h2>
                        </div>
                        <p style={{ textAlign: 'center', padding: '40px' }}>
                            Office hours management functionality would go here
                        </p>
                    </div>
                );

            default:
                return <div className="p-8 text-center">Select a view from the sidebar</div>;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar
                currentView={currentView}
                setCurrentView={handleSidebarNavigation}
                handleLogout={handleLogout}
            />
            <main className="main-content">
                {renderMainContent()}
            </main>
        </div>
    );
}

export default TADashboard;
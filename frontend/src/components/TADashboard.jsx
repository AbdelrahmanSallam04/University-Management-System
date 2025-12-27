import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../pages/TASidebar';
import RoomAvailabilityComponent from '../components/RoomAvailabilityComponent';
import MaintenanceReportForm from "../components/MaintenanceReportForm";
import TAOfficehours from '../components/OfficeHoursManager';
import '../styles/ProfessorDashboard.css';
import PublishContentView from "./PublishContent";
import TAPublishComponent from "./TAPublishComponent";

function TADashboard() {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('dashboard');
    const [taData, setTaData] = useState({
        firstName: 'Loading...',
        lastName: '',
        email: 'Loading...',
        departmentName: 'Loading...',
        assignedCourses: 0,
        officeHours: 0,
        userId: null,
        phone: '',
        salary: 0,
        accountType: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null);

    useEffect(() => {
        fetchTAData();
        fetchSessionInfo();
    }, []);

    const fetchSessionInfo = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/dashboard/ta/session', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setSessionInfo(data);
                console.log('Session info:', data);
            }
        } catch (error) {
            console.error('Error fetching session info:', error);
        }
    };

    const fetchTAData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8080/api/dashboard/ta', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('TA Data fetched:', data);

                    // Check if this is an error response
                    if (data.error || data.warning) {
                        console.warn('TA data has warnings:', data.error || data.warning);
                    }

                    setTaData({
                        firstName: data.firstName || 'TA',
                        lastName: data.lastName || 'User',
                        email: data.email || 'ta@university.edu',
                        departmentName: data.departmentName || 'Not Assigned',
                        assignedCourses: data.assignedCourses || 0,
                        officeHours: data.officeHours || 0,
                        userId: data.userId || data.sessionUserId || null,
                        phone: data.phone || 'Not available',
                        salary: data.salary || 0,
                        accountType: data.accountType || 'TA'
                    });

                } else if (response.status === 401) {
                    navigate('/login', { replace: true });
                } else if (response.status === 403) {
                    const errorText = await response.text();
                    setError(`Access denied: ${errorText}`);
                } else {
                    const errorText = await response.text();
                    setError(`Server error (${response.status}): ${errorText}`);
                }
            } catch (error) {
                console.error('Error fetching TA data:', error);
                setError('Network error. Please check your connection and ensure backend is running.');
            } finally {
                setLoading(false);
            }
        };

    const handleLogout = () => {
        navigate('/login', { replace: true });
    };

    const handleSidebarNavigation = (viewId) => {
        setCurrentView(viewId);
    };

    // Simple view renderer
    const renderMainContent = () => {
        if (loading && currentView === 'dashboard') {
            return (
                <div className="events-section" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div className="spinner"></div>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '20px' }}>
                        Loading TA profile data...
                    </p>
                </div>
            );
        }

        if (error && currentView === 'dashboard') {
            return (
                <div className="events-section" style={{ textAlign: 'center', marginTop: '50px', padding: '30px' }}>
                    <h3 style={{ color: '#ef4444', marginBottom: '20px' }}>Error Loading Dashboard</h3>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</p>

                    {sessionInfo && (
                        <div style={{
                            backgroundColor: '#f3f4f6',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            textAlign: 'left'
                        }}>
                            <h4 style={{ marginBottom: '10px' }}>Session Information:</h4>
                            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                                {JSON.stringify(sessionInfo, null, 2)}
                            </pre>
                        </div>
                    )}

                    <button
                        onClick={fetchTAData}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Retry Loading Data
                    </button>
                </div>
            );
        }

        const data = taData;

        switch (currentView) {
            case 'dashboard':
                return (
                    <>
                        <div className="welcome-section">
                            <div className="welcome-text">
                                <h1>Welcome, {data.firstName} {data.lastName}!</h1>
                                <p>Teaching Assistant Dashboard • {data.departmentName}</p>
                                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
                                    Account Type: {data.accountType} • User ID: {data.userId}
                                </p>
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
                                    <h3>{data.assignedCourses}</h3>
                                    <p>Assigned Courses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-blue">⏰</div>
                                <div className="stat-info">
                                    <h3>{data.officeHours}</h3>
                                    <p>Office Hours</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-green">🏛️</div>
                                <div className="stat-info">
                                    <h3>{data.departmentName}</h3>
                                    <p>Department</p>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid-row">
                            <div className="info-card profile-card">
                                <div className="card-header"><h3>👨‍🏫 TA Profile Details</h3></div>
                                <div className="card-body">
                                    <div className="profile-row">
                                        <div className="profile-icon-box">📧</div>
                                        <div className="profile-detail">
                                            <span className="label">Email</span>
                                            <span className="value">{data.email}</span>
                                        </div>
                                    </div>
                                    <div className="profile-row">
                                        <div className="profile-icon-box">📞</div>
                                        <div className="profile-detail">
                                            <span className="label">Phone</span>
                                            <span className="value">{data.phone}</span>
                                        </div>
                                    </div>
                                    <div className="profile-row">
                                        <div className="profile-icon-box">🏛️</div>
                                        <div className="profile-detail">
                                            <span className="label">Department</span>
                                            <span className="value badge">{data.departmentName}</span>
                                        </div>
                                    </div>
                                    <div className="profile-row">
                                        <div className="profile-icon-box">💰</div>
                                        <div className="profile-detail">
                                            <span className="label">Salary</span>
                                            <span className="value">${data.salary ? data.salary.toLocaleString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="info-card tips-card">
                                <div className="card-header"><h3>💡 Quick Actions</h3></div>
                                <div className="card-body">
                                    <ul className="tips-list">
                                        <li><strong>View Courses:</strong> Check assigned courses ({data.assignedCourses})</li>
                                        <li><strong>Grade Assignments:</strong> Grade student submissions</li>
                                        <li><strong>Set Office Hours:</strong> Manage your availability ({data.officeHours} hours)</li>
                                        <li><strong>Book Rooms:</strong> Reserve rooms for sessions</li>
                                        <li><strong>Report Issues:</strong> Submit maintenance requests</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'courses':
                return (
                    <div className="events-section">
                        <h2>📚 My Assigned Courses ({data.assignedCourses})</h2>
                        <div className="list-container">
                            <p style={{ textAlign: 'center', padding: '40px' }}>
                                Course listing functionality would go here
                            </p>
                        </div>
                    </div>
                );

            case 'publish_content':
                return <TAPublishComponent  />;

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
                        <RoomAvailabilityComponent />
                    </div>
                );

            case 'office_hours':
                return (
                    <div className="events-section">
                        <TAOfficehours staffMemberId={data.userId} />
                    </div>
                );

            case 'Maintenance_Report':
                return (
                    <div className="events-section">
                        <div className="page-header">
                            <h2>⚙️ Maintenance Report</h2>
                        </div>
                        <MaintenanceReportForm />
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
                userType="TA"
            />
            <main className="main-content">
                {renderMainContent()}
            </main>
        </div>
    );
}

export default TADashboard;
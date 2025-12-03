import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Professor SideBar';
import '../styles/ProfessorDashboard.css';
import { fetchAvailableRooms } from '../services/roomService'; // Make sure this path is correct
import axios from 'axios';

function ProfessorDashboard() {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        firstName: 'Professor',
        lastName: '',
        email: 'N/A',
        departmentName: 'N/A',
        numberOfAdvisedStudents: 0,
        numberOfCoursesTeaching: 0,
        adviseeStudents: [],
        taughtCourses: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');

    // Room Availability State
    const [roomAvailability, setRoomAvailability] = useState({
        selectedDate: new Date().toISOString().split('T')[0],
        selectedRoomType: 'All Rooms',
        availableRooms: [],
        isLoading: false,
        error: null
    });

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/dashboard/professor', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) {
                let message = `Failed to fetch dashboard data. Status: ${response.status}`;
                if (response.status === 401) {
                    console.log("Session expired or unauthorized. Redirecting...");
                    navigate('/login', { replace: true });
                    return;
                } else if (response.status === 403) {
                    message = "Forbidden. Not a Professor account.";
                } else if (response.status === 404) {
                    message = "Professor profile not found.";
                }
                throw new Error(message);
            }

            const data = await response.json();
            setDashboardData({
                firstName: data.firstName || 'Professor',
                lastName: data.lastName || '',
                email: data.email || 'N/A',
                departmentName: data.departmentName || 'N/A',
                numberOfAdvisedStudents: data.adviseeStudents ? data.adviseeStudents.length : 0,
                numberOfCoursesTeaching: data.taughtCourses ? data.taughtCourses.length : 0,
                adviseeStudents: data.adviseeStudents || [],
                taughtCourses: data.taughtCourses || [],
            });

        } catch (e) {
            console.error("Fetch error:", e);
            setError(e.message || "An unexpected network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // Room Availability Functions
    const loadRooms = useCallback(async () => {
        setRoomAvailability(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const data = await fetchAvailableRooms(
                roomAvailability.selectedDate,
                roomAvailability.selectedRoomType
            );
            setRoomAvailability(prev => ({ ...prev, availableRooms: data }));
        } catch (err) {
            let errorMessage = 'Failed to load room data. Check backend logs.';
            if (axios.isAxiosError(err) && !err.response) {
                errorMessage = 'Connection Error: Cannot reach backend server. Is Spring Boot running on localhost:8080?';
            } else if (err.response && err.response.data) {
                errorMessage = `API Error: ${err.response.data}`;
            }
            setRoomAvailability(prev => ({ ...prev, error: errorMessage }));
        } finally {
            setRoomAvailability(prev => ({ ...prev, isLoading: false }));
        }
    }, [roomAvailability.selectedDate, roomAvailability.selectedRoomType]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Load rooms when room availability view is active and dependencies change
    useEffect(() => {
        if (currentView === 'room_availability') {
            loadRooms();
        }
    }, [currentView, loadRooms]);

    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            await fetch('/logout', { method: 'POST' });
        } catch(err) {
            console.log("Backend logout failed, clearing frontend anyway");
        }
        navigate('/login', { replace: true });
    };

    // Updated sidebar navigation handler - no longer needs special routing
    const handleSidebarNavigation = (viewId) => {
        setCurrentView(viewId);
    };

    // Room Availability Handlers
    const handleDateChange = (e) => {
        setRoomAvailability(prev => ({ ...prev, selectedDate: e.target.value }));
    };

    const handleRoomTypeChange = (e) => {
        setRoomAvailability(prev => ({ ...prev, selectedRoomType: e.target.value }));
    };

    // --- HELPER COMPONENTS ---
    const StatCard = ({ title, value, icon, color }) => (
        <div className="stat-card">
            <div className={`stat-icon stat-icon-${color}`}>{icon}</div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );


    const CoursesList = ({ courses }) => (
        <div className="list-container">
            {courses.length > 0 ? (
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credit Hours</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course) => (
                        <tr key={course.courseId}>
                            <td>{course.courseId}</td>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.creditHours}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-data-message">You are not currently assigned to teach any courses.</p>
            )}
        </div>
    );

    // Room Availability Component
    const RoomAvailabilityView = () => {
        const { selectedDate, selectedRoomType, availableRooms, isLoading, error } = roomAvailability;

        const tableHeaderStyle = {
            padding: '15px 20px',
            textAlign: 'left',
            borderBottom: '2px solid #ddd',
            backgroundColor: '#e0e7ff'
        };
        const tableCellStyle = {
            padding: '15px 20px',
            textAlign: 'left'
        };

        return (
            <div className="calendar-page-container">
                {/* Page Title Header */}
                <div className="page-header">
                    <h2>🗓️ Classroom & Lab Availability</h2>
                </div>

                {/* Search and Filter Area */}
                <div className="room-filter-section">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />

                    <label>Room Type:</label>
                    <select
                        value={selectedRoomType}
                        onChange={handleRoomTypeChange}
                    >
                        <option value="All Rooms">All Rooms</option>
                        <option value="Classroom">Classroom</option>
                        <option value="Computer Lab">Computer Lab</option>
                    </select>

                    <button
                        onClick={loadRooms}
                        className="refresh-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {/* Availability List View */}
                <div className="availability-list-section">
                    {error && (
                        <div className="error-message">{error}</div>
                    )}
                    {isLoading && (
                        <div className="loading-message">Loading room availability...</div>
                    )}

                    {!isLoading && !error && (
                        <>
                            <h3 className="section-title">
                                Availability Status (Showing {availableRooms.length} slots for {new Date(selectedDate).toDateString()})
                            </h3>

                            <div className="table-wrapper">
                                <table className="availability-table">
                                    <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Room Code</th>
                                        <th style={tableHeaderStyle}>Type</th>
                                        <th style={tableHeaderStyle}>Capacity</th>
                                        <th style={tableHeaderStyle}>Time Slot / Status</th>
                                        <th style={tableHeaderStyle}>Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {availableRooms.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="no-data-cell">
                                                No room slots found for the selected criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        availableRooms.map((item, index) => (
                                            <tr key={item.id + "-" + index} className="table-row">
                                                <td style={tableCellStyle}>{item.roomCode}</td>
                                                <td style={tableCellStyle}>{item.roomType}</td>
                                                <td style={tableCellStyle}>{item.capacity}</td>
                                                <td style={{
                                                    ...tableCellStyle,
                                                    color: item.status === 'Free' ? '#10b981' : '#ef4444',
                                                    fontWeight: '600'
                                                }}>
                                                    {item.status} - {item.timeSlot}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    {item.status === 'Free' ? (
                                                        <button className="book-button">Book Slot</button>
                                                    ) : (
                                                        <span className="occupied-slot">{item.timeSlot}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderMainContent = () => {
        if (loading && currentView !== 'room_availability') {
            return (
                <div className="events-section" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading dashboard data...</p>
                </div>
            );
        }

        if (error && currentView !== 'room_availability') {
            return (
                <div className="events-section" style={{ textAlign: 'center', color: '#ef4444' }}>
                    <h3>Connection Error</h3>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="retry-button"
                    >
                        Retry Connection
                    </button>
                </div>
            );
        }

        const data = dashboardData;

        switch (currentView) {
            case 'dashboard':
                return (
                    <>
                        <div className="welcome-section">
                            <div className="welcome-text">
                                <h1>Welcome Back, Professor {data.lastName}!</h1>
                                <p>Quick access to your academic responsibilities.</p>
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
                            <StatCard
                                title="Courses Teaching"
                                value={data.numberOfCoursesTeaching}
                                icon="📚"
                                color="purple"
                            />
                        </div>

                        <div className="dashboard-grid-row">
                            <div className="info-card profile-card">
                                <div className="card-header">
                                    <h3>👨‍🏫 Profile Details</h3>
                                </div>
                                <div className="card-body">
                                    <div className="profile-row">
                                        <div className="profile-icon-box">📧</div>
                                        <div className="profile-detail">
                                            <span className="label">Email Address</span>
                                            <span className="value">{data.email}</span>
                                        </div>
                                    </div>
                                    <div className="profile-row">
                                        <div className="profile-icon-box">🏛️</div>
                                        <div className="profile-detail">
                                            <span className="label">Department</span>
                                            <span className="value badge">{data.departmentName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card tips-card">
                                <div className="card-header">
                                    <h3>💡 Quick Tips</h3>
                                </div>
                                <div className="card-body">
                                    <ul className="tips-list">
                                        <li><strong>Manage Students:</strong> Click "Advised Students" to view details.</li>
                                        <li><strong>Course Overview:</strong> Check "Courses Teaching" for codes.</li>
                                        <li><strong>Room Availability:</strong> Use the calendar tool.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'courses':
                return (
                    <div className="events-section">
                        <h2>📚 Courses Taught ({data.numberOfCoursesTeaching})</h2>
                        <CoursesList courses={data.taughtCourses} />
                    </div>
                );

            case 'room_availability':
                return <RoomAvailabilityView />;

            default:
                return <div className="p-8 text-center text-red-500">Unknown view selected.</div>;
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

export default ProfessorDashboard;
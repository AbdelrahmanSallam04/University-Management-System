import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Professor SideBar'; // Ensure this path matches your file structure
import '../styles/ProfessorDashboard.css';

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

                // --- FIX 1: SECURITY REDIRECT (401) ---
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

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // --- FIX 2: LOGOUT HISTORY REPLACEMENT ---
    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            await fetch('/logout', { method: 'POST' });
        } catch(err) {
            console.log("Backend logout failed, clearing frontend anyway");
        }
        // Wipes dashboard from history so 'Back' button doesn't work
        navigate('/login', { replace: true });
    };

    // --- FIX 3: CUSTOM NAVIGATION HANDLER ---
    // Intercepts Sidebar clicks. Routes to new page for Room Availability.
    const handleSidebarNavigation = (viewId) => {
        if (viewId === 'room_availability') {
            navigate('/room-availability');
        } else {
            setCurrentView(viewId);
        }
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

    const AdviseesList = ({ advisees }) => (
        <div className="list-container">
            {advisees.length > 0 ? (
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {advisees.map((student) => (
                        <tr key={student.studentId}>
                            <td>{student.studentId}</td>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td className="email-cell">{student.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-data-message">You are not currently advising any students.</p>
            )}
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

    const renderMainContent = () => {
        if (loading) {
            return (
                <div className="events-section" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading dashboard data...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="events-section" style={{ textAlign: 'center', color: '#ef4444' }}>
                    <h3>Connection Error</h3>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        style={{
                            padding: '10px 20px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
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
                                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <div className="stats-container">
                            <StatCard
                                title="Students Advised"
                                value={data.numberOfAdvisedStudents}
                                icon="🧑‍🎓"
                                color="blue"
                            />
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

            case 'advisees':
                return (
                    <div className="events-section">
                        <h2>🧑‍🎓 Advised Students ({data.numberOfAdvisedStudents})</h2>
                        <AdviseesList advisees={data.adviseeStudents} />
                    </div>
                );

            case 'courses':
                return (
                    <div className="events-section">
                        <h2>📚 Courses Taught ({data.numberOfCoursesTeaching})</h2>
                        <CoursesList courses={data.taughtCourses} />
                    </div>
                );

            default:
                return <div className="p-8 text-center text-red-500">Unknown view selected.</div>;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar
                currentView={currentView}
                setCurrentView={handleSidebarNavigation} // Use custom handler
                handleLogout={handleLogout}
            />
            <main className="main-content">
                {renderMainContent()}
            </main>
        </div>
    );
}

export default ProfessorDashboard;
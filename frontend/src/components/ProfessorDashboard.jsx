import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Professor SideBar';
import '../styles/ProfessorDashboard.css';
import { fetchAvailableRooms, bookRoom, fetchUserBookings  } from '../services/roomService'; // Imported bookRoom
import BookingFormModal from '../pages/BookingFormModal'; // Imported Modal
import axios from 'axios';

function ProfessorDashboard() {
    const navigate = useNavigate();

    // --- User/Dashboard State ---
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

    // --- Room Availability State ---
    const [roomAvailability, setRoomAvailability] = useState({
        selectedDate: new Date().toISOString().split('T')[0],
        selectedRoomType: 'All Rooms',
        availableRooms: [],
        isLoading: false,
        error: null
    });

    // --- Booking State (New) ---
    const [bookingState, setBookingState] = useState({
        isModalOpen: false,
        selectedSlot: null,
        myBookings: [] // To track session bookings
    });

    // --- DATA FETCHING ---
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

    // --- ROOM AVAILABILITY LOGIC ---
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

    useEffect(() => {
        if (currentView === 'room_availability') {
            loadRooms();
        }
    }, [currentView, loadRooms]);

    // --- BOOKING HANDLERS (New) ---

    const handleBookClick = (item) => {
        // Parse the time slot string "09:30-11:00"
        const [startTimeStr, endTimeStr] = item.timeSlot.split('-');

        setBookingState(prev => ({
            ...prev,
            isModalOpen: true,
            selectedSlot: {
                id: item.id,
                roomCode: item.roomCode,
                roomType: item.roomType,
                capacity: item.capacity,
                date: roomAvailability.selectedDate,
                timeSlot: item.timeSlot,
                startTime: startTimeStr,
                endTime: endTimeStr
            }
        }));
    };

    const handleBookingConfirm = async (purpose) => {
        const slot = bookingState.selectedSlot;
        if (!slot) return;

        // Construct payload expected by backend DTO
        // NOTE: In a real app, facultyId should come from the logged-in user context/session.
        // We are using a mock ID (10) or deriving it if dashboardData has an ID.
        const bookingPayload = {
            roomId: slot.id,
            purpose: purpose,
            startTime: `${slot.date}T${slot.startTime}:00`,
            endTime: `${slot.date}T${slot.endTime}:00`
        };

        try {
            await bookRoom(bookingPayload);

            // Close modal
            setBookingState(prev => ({ ...prev, isModalOpen: false, selectedSlot: null }));

            // Add to local booking list for feedback
            setBookingState(prev => ({
                ...prev,
                myBookings: [...prev.myBookings, { ...bookingPayload, roomCode: slot.roomCode, timeSlot: slot.timeSlot, date: slot.date }]
            }));

            // Refresh table to show "Booked" status
            await loadRooms();

            // Optional: You could show a success toast here
        } catch (err) {
            throw err; // The modal will catch and display this error
        }
    };

    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            await fetch('/logout', { method: 'POST' });
        } catch(err) {
            console.log("Backend logout failed, clearing frontend anyway");
        }
        navigate('/login', { replace: true });
    };

    const handleSidebarNavigation = (viewId) => {
        setCurrentView(viewId);
    };

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

    // --- ROOM AVAILABILITY VIEW ---
    const RoomAvailabilityView = () => {
        const { selectedDate, selectedRoomType, availableRooms, isLoading, error } = roomAvailability;
        const { myBookings, isModalOpen, selectedSlot } = bookingState;

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



        // --- My Bookings Section with Server Data ---
        const [userBookings, setUserBookings] = useState([]);
        const [loadingBookings, setLoadingBookings] = useState(false);

// Fetch user bookings when component mounts
        useEffect(() => {
            const loadUserBookings = async () => {
                if (currentView === 'room_availability') {
                    setLoadingBookings(true);
                    try {
                        const bookings = await fetchUserBookings();
                        setUserBookings(bookings);
                    } catch (err) {
                        console.error("Failed to fetch user bookings:", err);
                    } finally {
                        setLoadingBookings(false);
                    }
                }
            };
            loadUserBookings();
        }, [currentView]);


        return (
            <div className="calendar-page-container">
                <div className="page-header">
                    <h2>🗓️ Classroom & Lab Availability</h2>
                </div>

                <div className="room-filter-section">
                    <label>Date:</label>
                    <input type="date" value={selectedDate} onChange={handleDateChange} />

                    <label>Room Type:</label>
                    <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                        <option value="All Rooms">All Rooms</option>
                        <option value="Classroom">Classroom</option>
                        <option value="Computer Lab">Computer Lab</option>
                    </select>

                    <button onClick={loadRooms} className="refresh-button" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                <div style={{
                    marginTop: '40px',
                    padding: '25px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '15px'
                    }}>
                        <h3 style={{
                            color: '#1e40af',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{ fontSize: '24px' }}>📋</span>
                            My Bookings
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
            }}>
                {userBookings.length} booking{userBookings.length !== 1 ? 's' : ''}
            </span>
                            <button
                                onClick={() => {
                                    setLoadingBookings(true);
                                    fetchUserBookings()
                                        .then(data => setUserBookings(data))
                                        .catch(err => console.error(err))
                                        .finally(() => setLoadingBookings(false));
                                }}
                                disabled={loadingBookings}
                                style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                {loadingBookings ? '↻' : '↻ Refresh'}
                            </button>
                        </div>
                    </div>

                    {loadingBookings ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#64748b'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                            <p style={{ margin: 0, fontSize: '16px' }}>Loading your bookings...</p>
                        </div>
                    ) : userBookings.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#64748b'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                            <p style={{ margin: 0, fontSize: '16px' }}>No bookings yet. Book a room to see them here.</p>
                        </div>
                    ) : (
                        <div className="bookings-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '20px'
                        }}>
                            {userBookings.map((booking, index) => (
                                <div key={booking.bookingId || index} style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                     onMouseEnter={(e) => {
                                         e.currentTarget.style.transform = 'translateY(-4px)';
                                         e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                                     }}
                                     onMouseLeave={(e) => {
                                         e.currentTarget.style.transform = 'translateY(0)';
                                         e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                                     }}>
                                    {/* Status Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        backgroundColor: booking.status === 'CONFIRMED' ? '#dcfce7' :
                                            booking.status === 'PENDING' ? '#fef3c7' :
                                                booking.status === 'CANCELLED' ? '#fee2e2' : '#f1f5f9',
                                        color: booking.status === 'CONFIRMED' ? '#166534' :
                                            booking.status === 'PENDING' ? '#92400e' :
                                                booking.status === 'CANCELLED' ? '#991b1b' : '#475569',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {booking.status || 'CONFIRMED'}
                                    </div>

                                    {/* Room Header */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginRight: '12px'
                                        }}>
                                            {booking.roomCode?.charAt(0) || 'R'}
                                        </div>
                                        <div>
                                            <h4 style={{
                                                margin: '0 0 5px 0',
                                                color: '#1e293b',
                                                fontSize: '18px'
                                            }}>
                                                {booking.roomCode || 'Unknown Room'}
                                            </h4>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: '#64748b'
                                            }}>
                                                {booking.roomType || 'Classroom'} • Capacity: {booking.capacity || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div style={{
                                        backgroundColor: '#f8fafc',
                                        padding: '15px',
                                        borderRadius: '6px',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            gap: '10px'
                                        }}>
                                            <span style={{ fontSize: '20px' }}>📅</span>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#475569' }}>Date</div>
                                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                                    {new Date(booking.startTime || booking.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            gap: '10px'
                                        }}>
                                            <span style={{ fontSize: '20px' }}>⏰</span>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#475569' }}>Time</div>
                                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                                    {new Date(booking.startTime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} - {new Date(booking.endTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Purpose */}
                                    <div style={{
                                        backgroundColor: '#f1f5f9',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        marginBottom: '15px'
                                    }}>
                                        <p style={{
                                            margin: '0 0 5px 0',
                                            fontSize: '13px',
                                            color: '#475569',
                                            fontWeight: '600'
                                        }}>
                                            📝 Purpose:
                                        </p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '14px',
                                            color: '#334155'
                                        }}>
                                            {booking.purpose || 'No purpose provided'}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '15px',
                                        borderTop: '1px solid #e2e8f0'
                                    }}>
                        <span style={{
                            fontSize: '12px',
                            color: '#94a3b8'
                        }}>
                            Booked on: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                                        <button
                                            onClick={() => {
                                                // Add cancel functionality here
                                                console.log('Cancel booking:', booking.bookingId);
                                            }}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#ef4444',
                                                border: '1px solid #ef4444',
                                                padding: '5px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#ef4444';
                                                e.target.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = '#ef4444';
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="availability-list-section">
                    {error && <div className="error-message">{error}</div>}
                    {isLoading && <div className="loading-message">Loading room availability...</div>}

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
                                        <th style={tableHeaderStyle}>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {availableRooms.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="no-data-cell">No room slots found.</td>
                                        </tr>
                                    ) : (
                                        availableRooms.map((item, index) => (
                                            <tr key={index} className="table-row">
                                                <td style={tableCellStyle}>{item.roomCode}</td>
                                                <td style={tableCellStyle}>{item.roomType}</td>
                                                <td style={tableCellStyle}>{item.capacity}</td>
                                                <td style={{ ...tableCellStyle, color: item.status === 'Free' ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                                    {item.status} - {item.timeSlot}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    {item.status === 'Free' ? (
                                                        <button
                                                            className="book-button"
                                                            onClick={() => handleBookClick(item)}
                                                        >
                                                            Book Slot
                                                        </button>
                                                    ) : (
                                                        <span className="occupied-slot" style={{ fontSize: '14px', color: '#666' }}>Booked</span>
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

                {/* Recently Booked List */}
                {myBookings.length > 0 && (
                    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                        <h3 style={{ color: '#0284c7', margin: '0 0 10px 0' }}>✅ Your Recent Bookings</h3>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {myBookings.map((b, i) => (
                                <li key={i} style={{ marginBottom: '5px', color: '#334155' }}>
                                    <strong>{b.roomCode}</strong> on {b.date} ({b.timeSlot}) - <em>{b.purpose}</em>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Booking Modal */}
                {isModalOpen && (
                    <BookingFormModal
                        slotDetails={selectedSlot}
                        onClose={() => setBookingState(prev => ({ ...prev, isModalOpen: false }))}
                        onConfirm={handleBookingConfirm}
                    />
                )}
            </div>
        );
    };

    // --- MAIN RENDER LOGIC ---
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
                    <button onClick={fetchDashboardData} className="retry-button">Retry Connection</button>
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
                            <StatCard title="Students Advised" value={data.numberOfAdvisedStudents} icon="🧑‍🎓" color="blue" />
                            <StatCard title="Courses Teaching" value={data.numberOfCoursesTeaching} icon="📚" color="purple" />
                        </div>
                        {/* Profile and Tips Cards */}
                        <div className="dashboard-grid-row">
                            <div className="info-card profile-card">
                                <div className="card-header"><h3>👨‍🏫 Profile Details</h3></div>
                                <div className="card-body">
                                    <div className="profile-row">
                                        <div className="profile-icon-box">📧</div>
                                        <div className="profile-detail"><span className="label">Email Address</span><span className="value">{data.email}</span></div>
                                    </div>
                                    <div className="profile-row">
                                        <div className="profile-icon-box">🏛️</div>
                                        <div className="profile-detail"><span className="label">Department</span><span className="value badge">{data.departmentName}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="info-card tips-card">
                                <div className="card-header"><h3>💡 Quick Tips</h3></div>
                                <div className="card-body">
                                    <ul className="tips-list">
                                        <li><strong>Manage Students:</strong> Click "Advised Students".</li>
                                        <li><strong>Course Overview:</strong> Check "Courses Teaching".</li>
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
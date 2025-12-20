import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Professor SideBar';
import '../styles/ProfessorDashboard.css';
import { fetchAvailableRooms, bookRoom, fetchUserBookings } from '../services/roomService';
import BookingFormModal from '../pages/BookingFormModal';
import axios from 'axios';
import ProfessorGradingPage from './ProfessorGradingPage'; // Import the grading component
import OfficeHoursManager from './OfficeHoursManager'; // Adjust path as needed

function ProfessorDashboard() {
    const navigate = useNavigate();

    // --- User/Dashboard State ---
    const [dashboardData, setDashboardData] = useState({
        professorId: null,  // Added professorId
        firstName: 'Professor',
        lastName: '',
        email: 'N/A',
        departmentName: 'N/A',
        numberOfCoursesTeaching: 0,
        taughtCourses: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');

    // State for Viewing Materials (from first code)
    const [courseMaterials, setCourseMaterials] = useState(null);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null); // Track which item is expanded

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

    // --- Grading State ---
    const [gradingPage, setGradingPage] = useState(null); // 'assignment' or 'exam'
    const [currentItemForGrading, setCurrentItemForGrading] = useState(null);

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
                professorId: data.userId || data.professorId || null, // Added professorId
                firstName: data.firstName || 'Professor',
                lastName: data.lastName || '',
                email: data.email || 'N/A',
                departmentName: data.departmentName || 'N/A',
                numberOfCoursesTeaching: data.taughtCourses ? data.taughtCourses.length : 0,
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

    // --- VIEW MATERIALS HANDLERS (from first code) ---
    const handleViewMaterials = async (courseId) => {
        setLoadingMaterials(true);
        setExpandedItem(null);
        try {
            const response = await axios.get(`/api/courses/${courseId}/materials`);
            setCourseMaterials(response.data);
            setCurrentView('view_materials');
        } catch (err) {
            console.error(err);
            alert("Failed to retrieve course materials.");
        } finally {
            setLoadingMaterials(false);
        }
    };

    const toggleExpand = (type, id) => {
        if (expandedItem && expandedItem.type === type && expandedItem.id === id) {
            setExpandedItem(null);
        } else {
            setExpandedItem({ type, id });
        }
    };

    const handleBackToCourses = () => {
        console.log("Back button clicked");
        setCourseMaterials(null);
        setCurrentView('courses');
    };

    // --- BOOKING HANDLERS (New) ---
    const handleBookClick = (item) => {
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

        const bookingPayload = {
            roomId: slot.id,
            purpose: purpose,
            startTime: `${slot.date}T${slot.startTime}:00`,
            endTime: `${slot.date}T${slot.endTime}:00`
        };

        try {
            await bookRoom(bookingPayload);

            setBookingState(prev => ({ ...prev, isModalOpen: false, selectedSlot: null }));

            setBookingState(prev => ({
                ...prev,
                myBookings: [...prev.myBookings, { ...bookingPayload, roomCode: slot.roomCode, timeSlot: slot.timeSlot, date: slot.date }]
            }));

            await loadRooms();
        } catch (err) {
            throw err;
        }
    };

    // --- GRADING HANDLERS ---
    const handleGradeAssignment = (assignment) => {
        setCurrentItemForGrading(assignment);
        setGradingPage('assignment');
    };

    const handleGradeExam = (exam) => {
        setCurrentItemForGrading(exam);
        setGradingPage('exam');
    };

    const handleBackToMaterials = () => {
        setGradingPage(null);
        setCurrentItemForGrading(null);
        // If we were in materials view, stay there
        if (currentView === 'view_materials') {
            // Do nothing - we'll stay in materials view
        } else {
            setCurrentView('view_materials');
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
        // If navigating away, reset grading
        if (viewId !== 'view_materials') {
            setGradingPage(null);
            setCurrentItemForGrading(null);
        }
    };

    const handleDateChange = (e) => {
        setRoomAvailability(prev => ({ ...prev, selectedDate: e.target.value }));
    };

    const handleRoomTypeChange = (e) => {
        setRoomAvailability(prev => ({ ...prev, selectedRoomType: e.target.value }));
    };

    // --- PUBLISH CONTENT COMPONENT (from first code) ---
    const PublishContentView = () => {
        const [formData, setFormData] = useState({
            courseId: '',
            type: 'assignment',
            title: '',
            description: '',
            marks: '',
            // Exam specific fields
            startTime: '',
            endTime: '',
            examType: 'MIDTERM',
            durationMinutes: ''
        });
        const [status, setStatus] = useState({ loading: false, type: '', message: '' });

        const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!formData.courseId) return;
            setStatus({ loading: true, type: '', message: '' });

            const endpointType = formData.type === 'assignment' ? 'assignments' : 'exams';
            const url = `/api/publishing/professors/${dashboardData.professorId}/courses/${formData.courseId}/${endpointType}`;

            let payload;

            if (formData.type === 'assignment') {
                payload = {
                    title: formData.title,
                    description: formData.description,
                    marks: parseInt(formData.marks),
                    dueDate: formData.date + "T00:00:00"
                };
            } else {
                // Exam payload with new structure
                payload = {
                    title: formData.title,
                    description: formData.description,
                    totalMarks: parseInt(formData.marks),
                    startTime: formData.startTime + ":00", // Convert to ISO format
                    endTime: formData.endTime + ":00", // Convert to ISO format
                    examType: formData.examType,
                    durationMinutes: parseInt(formData.durationMinutes) || null
                };
            }

            try {
                await axios.post(url, payload);
                setStatus({
                    loading: false,
                    type: 'success',
                    message: `Successfully published ${formData.type}!`
                });
                // Reset form based on type
                if (formData.type === 'assignment') {
                    setFormData(prev => ({
                        ...prev,
                        title: '',
                        description: '',
                        marks: '',
                        date: ''
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        title: '',
                        description: '',
                        marks: '',
                        startTime: '',
                        endTime: '',
                        durationMinutes: '',
                        examType: 'MIDTERM'
                    }));
                }
            } catch (err) {
                setStatus({
                    loading: false,
                    type: 'error',
                    message: err.response?.data || "Failed to publish."
                });
            }
        };

        return (
            <div className="events-section">
                <div className="page-header"><h2>📝 Publish Course Content</h2></div>
                <div className="publish-form-wrapper">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Course</label>
                            <select
                                name="courseId"
                                className="form-control"
                                value={formData.courseId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Choose a Course --</option>
                                {dashboardData.taughtCourses.map(c => (
                                    <option key={c.courseId} value={c.courseId}>
                                        {c.code} - {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Content Type</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="assignment"
                                        checked={formData.type === 'assignment'}
                                        onChange={handleChange}
                                    /> Assignment
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="exam"
                                        checked={formData.type === 'exam'}
                                        onChange={handleChange}
                                    /> Exam
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="e.g. Midterm Project"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description (Questions)</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                {formData.type === 'assignment' ? 'Total Marks' : 'Total Marks'}
                            </label>
                            <input
                                type="number"
                                name="marks"
                                className="form-control"
                                value={formData.marks}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {formData.type === 'assignment' ? (
                            <div className="form-group">
                                <label className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            className="form-control"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Time</label>
                                        <input
                                            type="datetime-local"
                                            name="endTime"
                                            className="form-control"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Exam Type</label>
                                        <select
                                            name="examType"
                                            className="form-control"
                                            value={formData.examType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="MIDTERM">Midterm</option>
                                            <option value="FINAL">Final</option>
                                            <option value="QUIZ">Quiz</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            name="durationMinutes"
                                            className="form-control"
                                            placeholder="Optional"
                                            value={formData.durationMinutes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {status.message && (
                            <div className={`status-message status-${status.type}`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={status.loading}
                        >
                            {status.loading ? 'Publishing...' : 'Publish Content'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // --- VIEW MATERIALS RENDER HELPER (from first code) ---
    const renderMaterialsSection = () => {
        if (loadingMaterials) return <div className="p-8">Loading materials...</div>;
        if (!courseMaterials) return <div className="p-8">No data found.</div>;

        return (
            <div className="events-section">
                <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>📂 Content for: {courseMaterials.courseName}</h2>
                    <button
                        type="button"
                        className="submit-btn"
                        style={{width: 'auto', padding: '10px 20px', backgroundColor: '#6c757d', cursor: 'pointer', zIndex: 100}}
                        onClick={handleBackToCourses}
                    >
                        ⬅ Back to Courses
                    </button>
                </div>

                <h3 style={{marginTop: '20px', color: '#333'}}>Assignments</h3>
                <div className="list-container">
                    <table className="data-table">
                        <thead><tr><th>Title</th><th>Marks</th><th>Due Date</th><th>Actions</th></tr></thead>
                        <tbody>
                        {courseMaterials.assignments && courseMaterials.assignments.length > 0 ? (
                            courseMaterials.assignments.map(a => (
                                <React.Fragment key={a.id}>
                                    <tr style={{backgroundColor: expandedItem?.id === a.id && expandedItem?.type === 'assignment' ? '#f0f8ff' : 'transparent'}}>
                                        <td>{a.title}</td>
                                        <td>{a.marks}</td>
                                        <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                                        <td style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                className="submit-btn"
                                                style={{padding: '5px 10px', width: 'auto', fontSize: '0.8rem'}}
                                                onClick={() => toggleExpand('assignment', a.id)}
                                            >
                                                {expandedItem?.id === a.id && expandedItem?.type === 'assignment' ? 'Hide Details' : 'View Details'}
                                            </button>
                                            <button
                                                className="submit-btn"
                                                style={{
                                                    padding: '5px 10px',
                                                    width: 'auto',
                                                    fontSize: '0.8rem',
                                                    backgroundColor: '#28a745'
                                                }}
                                                onClick={() => handleGradeAssignment(a)}
                                            >
                                                Grade Assignment
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedItem?.id === a.id && expandedItem?.type === 'assignment' && (
                                        <tr>
                                            <td colSpan="4" style={{backgroundColor: '#fafafa', padding: '20px', borderLeft: '4px solid #007bff'}}>
                                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                                    <h4 style={{marginBottom:'10px', color:'#007bff'}}>Questions / Description:</h4>
                                                    {a.description ? a.description : "No content provided."}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{textAlign:'center'}}>No assignments created yet.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <h3 style={{marginTop: '30px', color: '#333'}}>Exams</h3>
                <div className="list-container">
                    <table className="data-table">
                        <thead><tr><th>Title</th><th>Marks</th><th>Exam Date</th><th>Actions</th></tr></thead>
                        <tbody>
                        {courseMaterials.exams && courseMaterials.exams.length > 0 ? (
                            courseMaterials.exams.map(e => (
                                <React.Fragment key={e.id}>
                                    <tr style={{backgroundColor: expandedItem?.id === e.id && expandedItem?.type === 'exam' ? '#f0f8ff' : 'transparent'}}>
                                        <td>{e.title}</td>
                                        <td>{e.marks}</td>
                                        <td>{new Date(e.examDate).toLocaleDateString()}</td>
                                        <td style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                className="submit-btn"
                                                style={{padding: '5px 10px', width: 'auto', fontSize: '0.8rem'}}
                                                onClick={() => toggleExpand('exam', e.id)}
                                            >
                                                {expandedItem?.id === e.id && expandedItem?.type === 'exam' ? 'Hide Details' : 'View Details'}
                                            </button>
                                            <button
                                                className="submit-btn"
                                                style={{
                                                    padding: '5px 10px',
                                                    width: 'auto',
                                                    fontSize: '0.8rem',
                                                    backgroundColor: '#28a745'
                                                }}
                                                onClick={() => handleGradeExam(e)}
                                            >
                                                Grade Exam
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedItem?.id === e.id && expandedItem?.type === 'exam' && (
                                        <tr>
                                            <td colSpan="4" style={{backgroundColor: '#fafafa', padding: '20px', borderLeft: '4px solid #dc3545'}}>
                                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                                    <h4 style={{marginBottom:'10px', color:'#dc3545'}}>Questions / Description:</h4>
                                                    {e.description ? e.description : "No content provided."}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{textAlign:'center'}}>No exams created yet.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
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
                        <th>Action</th> {/* Added action column */}
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course) => (
                        <tr key={course.courseId}>
                            <td>{course.courseId}</td>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.creditHours}</td>
                            <td>
                                <button className="submit-btn" style={{padding: '5px 10px', fontSize: '0.9rem', width: 'auto'}} onClick={() => handleViewMaterials(course.courseId)}>
                                    View Content
                                </button>
                            </td>
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

        const [userBookings, setUserBookings] = useState([]);
        const [loadingBookings, setLoadingBookings] = useState(false);

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
                            <StatCard title="Courses Teaching" value={data.numberOfCoursesTeaching} icon="📚" color="purple" />
                        </div>
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
                                        <li><strong>Course Overview:</strong> Check "Courses Teaching".</li>
                                        <li><strong>Room Availability:</strong> Use the calendar tool.</li>
                                        <li><strong>Publish Content:</strong> Create assignments and exams.</li>
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

            case 'view_materials':
                return renderMaterialsSection();

            case 'publish_content':
                return <PublishContentView />;
            case 'office_hours':
                return <OfficeHoursManager professorId={dashboardData.professorId} />;

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
                {gradingPage ? (
                    <ProfessorGradingPage

                        gradingType={gradingPage}
                        currentItem={currentItemForGrading}
                        onBackToMaterials={handleBackToMaterials}
                    />
                ) : (
                    renderMainContent()
                )}
            </main>
        </div>
    );
}

export default ProfessorDashboard;
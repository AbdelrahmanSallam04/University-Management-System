import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Professor SideBar';
import '../styles/ProfessorDashboard.css'; // Make sure this path is correct
import { fetchAvailableRooms } from '../services/roomService';
import axios from 'axios';

function ProfessorDashboard() {
    const navigate = useNavigate();

    // --- STATE ---
    const [dashboardData, setDashboardData] = useState({
        professorId: null,
        firstName: '',
        lastName: '',
        numberOfCoursesTeaching: 0,
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

    // --- FETCH DATA ---
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/dashboard/professor', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            setDashboardData({
                professorId: data.userId || data.professorId || 3, // Ensure ID is captured
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                numberOfCoursesTeaching: data.taughtCourses ? data.taughtCourses.length : 0,
                taughtCourses: data.taughtCourses || [],
            });
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const loadRooms = useCallback(async () => {
        setRoomAvailability(prev => ({ ...prev, isLoading: true }));
        try {
            const data = await fetchAvailableRooms(roomAvailability.selectedDate, roomAvailability.selectedRoomType);
            setRoomAvailability(prev => ({ ...prev, availableRooms: data, isLoading: false }));
        } catch (err) {
            setRoomAvailability(prev => ({ ...prev, error: "Failed to load rooms", isLoading: false }));
        }
    }, [roomAvailability.selectedDate, roomAvailability.selectedRoomType]);

    useEffect(() => { fetchDashboardData(); }, []);
    useEffect(() => { if (currentView === 'room_availability') loadRooms(); }, [currentView, loadRooms]);

    // --- SUB-COMPONENTS ---

    const PublishContentView = () => {
        const [formData, setFormData] = useState({
            courseId: '',
            type: 'assignment',
            title: '',
            description: '',
            marks: '',
            date: ''
        });
        const [status, setStatus] = useState({ loading: false, type: '', message: '' });

        const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!formData.courseId) return;

            setStatus({ loading: true, type: '', message: '' });

            const endpointType = formData.type === 'assignment' ? 'assignments' : 'exams';
            const url = `/api/publishing/professors/${dashboardData.professorId}/courses/${formData.courseId}/${endpointType}`;

            const payload = {
                title: formData.title,
                description: formData.description,
                marks: parseInt(formData.marks),
                [formData.type === 'assignment' ? 'dueDate' : 'exam_date']: formData.date + "T00:00:00"
            };

            try {
                await axios.post(url, payload);
                setStatus({ loading: false, type: 'success', message: `Successfully published ${formData.type}!` });
                setFormData(prev => ({ ...prev, title: '', description: '', marks: '', date: '' }));
            } catch (err) {
                setStatus({ loading: false, type: 'error', message: err.response?.data || "Failed to publish." });
            }
        };

        return (
            <div className="events-section">
                <div className="page-header">
                    <h2>📝 Publish Course Content</h2>
                </div>

                <div className="publish-form-wrapper">
                    <form onSubmit={handleSubmit}>

                        {/* Course Select */}
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
                                    <option key={c.courseId} value={c.courseId}>{c.code} - {c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Radio Buttons */}
                        <div className="form-group">
                            <label className="form-label">Content Type</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio" name="type" value="assignment"
                                        checked={formData.type === 'assignment'} onChange={handleChange}
                                    /> Assignment
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio" name="type" value="exam"
                                        checked={formData.type === 'exam'} onChange={handleChange}
                                    /> Exam
                                </label>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text" name="title" className="form-control"
                                placeholder="e.g. Midterm Project"
                                value={formData.title} onChange={handleChange} required
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description" className="form-control" rows="3"
                                value={formData.description} onChange={handleChange}
                            />
                        </div>

                        {/* Marks & Date Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Total Marks</label>
                                <input
                                    type="number" name="marks" className="form-control"
                                    value={formData.marks} onChange={handleChange} required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    {formData.type === 'assignment' ? 'Due Date' : 'Exam Date'}
                                </label>
                                <input
                                    type="date" name="date" className="form-control"
                                    value={formData.date} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* Status Message */}
                        {status.message && (
                            <div className={`status-message status-${status.type}`}>
                                {status.message}
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={status.loading}>
                            {status.loading ? 'Publishing...' : 'Publish Content'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const RoomAvailabilityView = () => (
        <div className="calendar-page-container">
            <div className="page-header"><h2>🗓️ Room Availability</h2></div>
            {/* Reuse existing logic/UI for filters here if needed */}
            <div className="table-wrapper">
                <table className="availability-table">
                    <thead><tr><th>Room</th><th>Status</th></tr></thead>
                    <tbody>
                    {roomAvailability.availableRooms.length === 0 ?
                        <tr><td colSpan="2">No rooms loaded or found.</td></tr> :
                        roomAvailability.availableRooms.map((r, i) => (
                            <tr key={i}><td>{r.roomCode}</td><td>{r.status}</td></tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- MAIN RENDER ---
    const renderContent = () => {
        if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
        if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

        switch (currentView) {
            case 'dashboard':
                return (
                    <>
                        <div className="welcome-section">
                            <h1>Welcome Back, Professor {dashboardData.firstName} {dashboardData.lastName}</h1>
                            <p>{new Date().toDateString()}</p>
                        </div>
                        <div className="stats-container">
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-purple">📚</div>
                                <div><h3>{dashboardData.numberOfCoursesTeaching}</h3><p>Courses</p></div>
                            </div>
                        </div>
                    </>
                );
            case 'courses':
                return (
                    <div className="events-section">
                        <div className="page-header"><h2>📚 My Courses</h2></div>
                        <div className="list-container">
                            <table className="data-table">
                                <thead><tr><th>Code</th><th>Name</th></tr></thead>
                                <tbody>
                                {dashboardData.taughtCourses.map(c => (
                                    <tr key={c.courseId}><td>{c.code}</td><td>{c.name}</td></tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'room_availability': return <RoomAvailabilityView />;
            case 'publish_content': return <PublishContentView />;
            default: return <div>Unknown View</div>;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} handleLogout={() => navigate('/login')} />
            <main className="main-content">{renderContent()}</main>
        </div>
    );
}

export default ProfessorDashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Professor SideBar';
import '../styles/ProfessorDashboard.css';
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

    // State for Viewing Materials
    const [courseMaterials, setCourseMaterials] = useState(null);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    // Track which item is expanded: { type: 'assignment'|'exam', id: 1 }
    const [expandedItem, setExpandedItem] = useState(null);

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
                professorId: data.userId || data.professorId || 3,
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

    // --- HANDLERS ---

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
        console.log("Back button clicked"); // Debugging log
        setCourseMaterials(null); // Optional: clear data
        setCurrentView('courses');
    };

    // --- RENDER HELPERS (Not Components) ---

    const renderMaterialsSection = () => {
        if (loadingMaterials) return <div className="p-8">Loading materials...</div>;
        if (!courseMaterials) return <div className="p-8">No data found.</div>;

        return (
            <div className="events-section">
                <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>📂 Content for: {courseMaterials.courseName}</h2>
                    {/* BACK BUTTON */}
                    <button
                        type="button"
                        className="submit-btn"
                        style={{width: 'auto', padding: '10px 20px', backgroundColor: '#6c757d', cursor: 'pointer', zIndex: 100}}
                        onClick={handleBackToCourses}
                    >
                        ⬅ Back to Courses
                    </button>
                </div>

                {/* --- ASSIGNMENTS TABLE --- */}
                <h3 style={{marginTop: '20px', color: '#333'}}>Assignments</h3>
                <div className="list-container">
                    <table className="data-table">
                        <thead><tr><th>Title</th><th>Marks</th><th>Due Date</th><th>Action</th></tr></thead>
                        <tbody>
                        {courseMaterials.assignments && courseMaterials.assignments.length > 0 ? (
                            courseMaterials.assignments.map(a => (
                                <React.Fragment key={a.id}>
                                    <tr style={{backgroundColor: expandedItem?.id === a.id && expandedItem?.type === 'assignment' ? '#f0f8ff' : 'transparent'}}>
                                        <td>{a.title}</td>
                                        <td>{a.marks}</td>
                                        <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="submit-btn"
                                                style={{padding: '5px 10px', width: 'auto', fontSize: '0.8rem'}}
                                                onClick={() => toggleExpand('assignment', a.id)}
                                            >
                                                {expandedItem?.id === a.id && expandedItem?.type === 'assignment' ? 'Hide Details' : 'View Details'}
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

                {/* --- EXAMS TABLE --- */}
                <h3 style={{marginTop: '30px', color: '#333'}}>Exams</h3>
                <div className="list-container">
                    <table className="data-table">
                        <thead><tr><th>Title</th><th>Marks</th><th>Exam Date</th><th>Action</th></tr></thead>
                        <tbody>
                        {courseMaterials.exams && courseMaterials.exams.length > 0 ? (
                            courseMaterials.exams.map(e => (
                                <React.Fragment key={e.id}>
                                    <tr style={{backgroundColor: expandedItem?.id === e.id && expandedItem?.type === 'exam' ? '#f0f8ff' : 'transparent'}}>
                                        <td>{e.title}</td>
                                        <td>{e.marks}</td>
                                        <td>{new Date(e.examDate).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="submit-btn"
                                                style={{padding: '5px 10px', width: 'auto', fontSize: '0.8rem'}}
                                                onClick={() => toggleExpand('exam', e.id)}
                                            >
                                                {expandedItem?.id === e.id && expandedItem?.type === 'exam' ? 'Hide Details' : 'View Details'}
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

    const renderPublishContent = () => {
        // NOTE: Form state handling inside a render helper can be tricky.
        // Ideally PublishContentView should be a separate file/component.
        // For now, I'm keeping the wrapper component approach JUST for this form
        // to maintain local form state, but 'renderMaterials' above is fixed.
        return <PublishContentView />;
    };

    // Keep this component separate because it has its own extensive form state
    const PublishContentView = () => {
        const [formData, setFormData] = useState({
            courseId: '', type: 'assignment', title: '', description: '', marks: '', date: ''
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
                <div className="page-header"><h2>📝 Publish Course Content</h2></div>
                <div className="publish-form-wrapper">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Course</label>
                            <select name="courseId" className="form-control" value={formData.courseId} onChange={handleChange} required>
                                <option value="">-- Choose a Course --</option>
                                {dashboardData.taughtCourses.map(c => <option key={c.courseId} value={c.courseId}>{c.code} - {c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Content Type</label>
                            <div className="radio-group">
                                <label className="radio-label"><input type="radio" name="type" value="assignment" checked={formData.type === 'assignment'} onChange={handleChange} /> Assignment</label>
                                <label className="radio-label"><input type="radio" name="type" value="exam" checked={formData.type === 'exam'} onChange={handleChange} /> Exam</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input type="text" name="title" className="form-control" placeholder="e.g. Midterm Project" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description (Questions)</label>
                            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Total Marks</label>
                                <input type="number" name="marks" className="form-control" value={formData.marks} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{formData.type === 'assignment' ? 'Due Date' : 'Exam Date'}</label>
                                <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
                            </div>
                        </div>
                        {status.message && <div className={`status-message status-${status.type}`}>{status.message}</div>}
                        <button type="submit" className="submit-btn" disabled={status.loading}>{status.loading ? 'Publishing...' : 'Publish Content'}</button>
                    </form>
                </div>
            </div>
        );
    };

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
                                <thead><tr><th>Code</th><th>Name</th><th>Action</th></tr></thead>
                                <tbody>
                                {dashboardData.taughtCourses.map(c => (
                                    <tr key={c.courseId}>
                                        <td>{c.code}</td>
                                        <td>{c.name}</td>
                                        <td>
                                            <button className="submit-btn" style={{padding: '5px 10px', fontSize: '0.9rem', width: 'auto'}} onClick={() => handleViewMaterials(c.courseId)}>
                                                View Content
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            // DIRECTLY CALL THE RENDER FUNCTION
            case 'view_materials': return renderMaterialsSection();

            case 'room_availability':
                return (
                    <div className="calendar-page-container">
                        <div className="page-header"><h2>🗓️ Room Availability</h2></div>
                        <div className="table-wrapper">
                            <table className="availability-table">
                                <thead><tr><th>Room</th><th>Status</th></tr></thead>
                                <tbody>
                                {roomAvailability.availableRooms.length === 0 ? <tr><td colSpan="2">No rooms loaded or found.</td></tr> : roomAvailability.availableRooms.map((r, i) => (<tr key={i}><td>{r.roomCode}</td><td>{r.status}</td></tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'publish_content': return renderPublishContent();
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
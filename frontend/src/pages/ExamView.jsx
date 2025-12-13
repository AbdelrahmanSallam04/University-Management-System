import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ExamView.css';
import Sidebar from '../components/StudentSidebar'

const ExamView = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/exams/my-exams', {
                withCredentials: true
            });
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setError('Failed to load exams. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = async (examId) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/exam-submissions/${examId}/start`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                navigate(`/exam/${examId}`, {
                    state: { submissionId: response.data.submission.examSubmissionId }
                });
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to start exam');
        }
    };

    const getFilteredExams = () => {
        let filtered = [...exams];

        // Filter by course
        if (selectedCourse !== 'all') {
            filtered = filtered.filter(exam => exam.courseId === parseInt(selectedCourse));
        }

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(exam => exam.status === selectedStatus);
        }

        return filtered;
    };

    const getCourses = () => {
        const courses = exams.reduce((acc, exam) => {
            if (!acc.some(c => c.courseId === exam.courseId)) {
                acc.push({
                    courseId: exam.courseId,
                    courseCode: exam.courseCode,
                    courseName: exam.courseName
                });
            }
            return acc;
        }, []);
        return courses;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'ongoing': return 'badge-ongoing';
            case 'upcoming': return 'badge-upcoming';
            case 'past': return 'badge-past';
            default: return '';
        }
    };

    const getSubmissionBadgeClass = (submissionStatus) => {
        switch (submissionStatus) {
            case 'SUBMITTED': return 'badge-submitted';
            case 'GRADED': return 'badge-graded';
            case 'IN_PROGRESS': return 'badge-in-progress';
            case 'NOT_ATTEMPTED': return 'badge-not-attempted';
            case 'LATE': return 'badge-late';
            default: return '';
        }
    };

    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeRemainingText = (exam) => {
        if (exam.status === 'past') return 'Exam ended';
        if (exam.status === 'upcoming') return `Starts in ${exam.timeRemaining}`;
        return `${exam.timeRemaining} remaining`;
    };

    if (loading) {
        return (
            <div className="exams-wrapper">
                <Sidebar />
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading your exams...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="exams-wrapper">
                <Sidebar />
                <div className="error-section">
                    <div className="error-icon">⚠️</div>
                    <h3>Error Loading Exams</h3>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={fetchExams} className="retry-button">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const filteredExams = getFilteredExams();
    const courses = getCourses();

    return (
        <div className="exams-wrapper">
            <Sidebar />
            <div className="main-content">
                {/* Header */}
                <div className="exams-header">
                    <div className="header-content">
                        <h1>My Exams</h1>
                        <p>View and take your scheduled exams</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-cards">
                    <div className="stat-card total">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <div className="stat-number">{exams.length}</div>
                            <div className="stat-label">Total Exams</div>
                        </div>
                    </div>
                    <div className="stat-card upcoming">
                        <div className="stat-icon">⏰</div>
                        <div className="stat-content">
                            <div className="stat-number">
                                {exams.filter(e => e.status === 'upcoming').length}
                            </div>
                            <div className="stat-label">Upcoming</div>
                        </div>
                    </div>
                    <div className="stat-card active">
                        <div className="stat-icon">🚀</div>
                        <div className="stat-content">
                            <div className="stat-number">
                                {exams.filter(e => e.status === 'ongoing').length}
                            </div>
                            <div className="stat-label">Active Now</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('all')}
                        >
                            All Exams
                        </button>
                        <button
                            className={`filter-btn ${selectedStatus === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`filter-btn ${selectedStatus === 'ongoing' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('ongoing')}
                        >
                            Active
                        </button>
                        <button
                            className={`filter-btn ${selectedStatus === 'past' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('past')}
                        >
                            Completed
                        </button>

                        <select
                            className="course-filter"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="all">All Courses</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Exams Container */}
                <div className="exams-container">
                    {filteredExams.length === 0 ? (
                        <div className="no-exams">
                            <div className="empty-state-icon">📚</div>
                            <h3>No Exams Found</h3>
                            <p>You don't have any exams scheduled for the selected filters.</p>
                        </div>
                    ) : (
                        <div className="exams-list">
                            {filteredExams.map(exam => (
                                <div key={exam.examId} className="exam-card">
                                    {/* Status ribbon */}
                                    <div className={`status-ribbon ${getStatusBadgeClass(exam.status)}`}>
                                        {exam.status.toUpperCase()}
                                    </div>

                                    <div className="exam-header">
                                        <div className="header-left">
                                            <h3 className="exam-title">{exam.title}</h3>
                                            <div className="course-info">
                                                <span className="course-code">{exam.courseCode}</span>
                                                <span className="course-name">{exam.courseName}</span>
                                            </div>
                                            {exam.attempted && exam.submissionStatus && (
                                                <div className={`submission-badge ${getSubmissionBadgeClass(exam.submissionStatus)}`}>
                                                    {exam.submissionStatus.replace('_', ' ')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="header-right">
                                            <div className="exam-marks">
                                                {exam.obtainedMarks !== null && exam.obtainedMarks !== undefined ? (
                                                    <div className="marks-obtained">
                                                        <span className="obtained">{exam.obtainedMarks}</span>
                                                        <span className="total">/{exam.totalMarks}</span>
                                                    </div>
                                                ) : (
                                                    <div className="marks-total">
                                                        {exam.totalMarks} marks
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="exam-description">{exam.description}</p>

                                    <div className="exam-details">
                                        <div className="detail-row">
                                            <div className="detail-item">
                                                <span className="detail-label">Type:</span>
                                                <span className="detail-value">{exam.examType}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Duration:</span>
                                                <span className="detail-value">{exam.durationMinutes} minutes</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Time:</span>
                                                <span className={`detail-value ${exam.status}`}>
                                                    {getTimeRemainingText(exam)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-item">
                                                <span className="detail-label">Starts:</span>
                                                <span className="detail-value">{formatDateTime(exam.startTime)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Ends:</span>
                                                <span className="detail-value">{formatDateTime(exam.endTime)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="exam-actions">
                                        {exam.status === 'ongoing' && !exam.attempted ? (
                                            <button
                                                className="start-exam-btn"
                                                onClick={() => handleStartExam(exam.examId)}
                                            >
                                                <span>Start Attempt</span>
                                                <span className="btn-icon">🚀</span>
                                            </button>
                                        ) : exam.attempted ? (
                                            <div className="attempted-info">
                                                {exam.submissionStatus === 'SUBMITTED' && (
                                                    <span className="submitted-text">Submitted</span>
                                                )}
                                                {exam.submissionStatus === 'IN_PROGRESS' && (
                                                    <button
                                                        className="continue-exam-btn"
                                                        onClick={() => navigate(`/exam/${exam.examId}`)}
                                                    >
                                                        Continue Exam
                                                    </button>
                                                )}
                                                {exam.submissionStatus === 'GRADED' && (
                                                    <button
                                                        className="view-results-btn"
                                                        onClick={() => navigate(`/student/exam/${exam.examId}/results`)}
                                                    >
                                                        View Results
                                                    </button>
                                                )}
                                            </div>
                                        ) : exam.status === 'upcoming' ? (
                                            <div className="upcoming-info">
                                                <span className="upcoming-text">Available in {exam.timeRemaining}</span>
                                            </div>
                                        ) : (
                                            <div className="past-info">
                                                <span className="past-text">Exam Ended</span>
                                                {exam.attempted && exam.submissionStatus === 'SUBMITTED' && (
                                                    <button
                                                        className="view-details-btn"
                                                        onClick={() => navigate(`/student/exam/${exam.examId}/results`)}
                                                    >
                                                        View Details
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamView;
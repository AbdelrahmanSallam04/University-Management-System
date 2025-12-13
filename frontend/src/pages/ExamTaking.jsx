import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../styles/ExamTaking.css';


const ExamTaking = () => {
    const { examId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [warningShown, setWarningShown] = useState(false);
    const [timeExceeded, setTimeExceeded] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const timeTakenRef = useRef(0);
    const textareaRef = useRef(null);

    useEffect(() => {
        fetchExamDetails();

        // Prevent navigating away during exam
        const handleBeforeUnload = (e) => {
            if (!submitting) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [examId]);

    useEffect(() => {
        if (exam && submission?.status === 'IN_PROGRESS') {
            startTimer();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [exam, submission]);

    useEffect(() => {
        // Calculate word count
        const words = answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length;
        setWordCount(words);
    }, [answer]);

    const fetchExamDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8080/api/exams/${examId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                const examData = response.data.exam;
                setExam(examData);

                if (examData.submission) {
                    setSubmission(examData.submission);
                    // Load saved answer if any
                    if (examData.submission.answers) {
                        setAnswer(examData.submission.answers);
                    }
                } else {
                    // Start exam if not started
                    await startExam();
                }

                // Calculate initial time left based on exam duration
                if (examData.durationMinutes) {
                    setTimeLeft(examData.durationMinutes * 60);
                }
            }
        } catch (error) {
            console.error('Error fetching exam details:', error);
            alert(error.response?.data?.message || 'Failed to load exam. Please try again.');
            navigate('/exams');
        } finally {
            setLoading(false);
        }
    };

    const startExam = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/exam-submissions/${examId}/start`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                setSubmission(response.data.submission);
                startTimeRef.current = new Date();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to start exam');
            navigate('/exams');
        }
    };

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timerRef.current);
                    setTimeExceeded(true);
                    handleAutoSubmit();
                    return 0;
                }

                // Show warning when 5 minutes left
                if (prev <= 300 && !warningShown) {
                    setWarningShown(true);
                    alert('Warning: 5 minutes remaining!');
                }

                return prev - 1;
            });

            // Update time taken
            if (startTimeRef.current) {
                const timeDiff = Math.floor((new Date() - startTimeRef.current) / 1000);
                timeTakenRef.current = Math.floor(timeDiff / 60); // in minutes
            }
        }, 1000);
    };

    const handleAutoSubmit = async () => {
        if (submitting) return;

        setSubmitting(true);
        try {
            await submitExam();
            alert('Time is up! Your exam has been automatically submitted.');
        } catch (error) {
            alert('Failed to auto-submit exam. Please contact your instructor.');
        }
    };

    const handleSubmit = async () => {
        if (!answer.trim()) {
            const confirmEmpty = window.confirm('You haven\'t provided any answer. Are you sure you want to submit?');
            if (!confirmEmpty) return;
        }

        const confirmSubmit = window.confirm('Are you sure you want to submit your exam? You cannot return to it after submission.');
        if (!confirmSubmit) return;

        await submitExam();
    };

    const submitExam = async () => {
        setSubmitting(true);
        try {
            const submitData = {
                examId: parseInt(examId),
                answers: answer,
                timeTakenMinutes: timeTakenRef.current || 1
            };

            const response = await axios.post(
                'http://localhost:8080/api/exam-submissions/submit',
                submitData,
                { withCredentials: true }
            );

            if (response.data.success) {
                alert('Exam submitted successfully!');
                navigate('/exams');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit exam. Please try again.');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSaveDraft = () => {
        // In a real app, you might want to auto-save to backend
        alert('Note: Your answer is saved locally. Remember to submit before time runs out!');
    };

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    if (loading) {
        return (
            <div className="exam-taking-wrapper">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading exam...</p>
                </div>
            </div>
        );
    }

    if (timeExceeded) {
        return (
            <div className="exam-taking-wrapper">
                <div className="time-up-section">
                    <div className="time-up-icon">⏰</div>
                    <h2>Time's Up!</h2>
                    <p>Your exam has been automatically submitted.</p>
                    <button
                        className="back-to-exams-btn"
                        onClick={() => navigate('/exams')}
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="exam-taking-wrapper">
                <div className="error-section">
                    <div className="error-icon">⚠️</div>
                    <h3>Exam Not Found</h3>
                    <p>The exam you're trying to access is not available.</p>
                    <button
                        className="back-button"
                        onClick={() => navigate('/exams')}
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="exam-taking-wrapper">
            {/* Exam Header */}
            <div className="exam-header-bar">
                <div className="header-left">
                    <button
                        className="back-btn"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to leave? Your progress may be lost.')) {
                                navigate('/exams');
                            }
                        }}
                    >
                        ← Back
                    </button>
                    <div className="exam-title-info">
                        <h1>{exam.title}</h1>
                        <div className="course-info">
                            <span className="course-code">{exam.courseCode}</span>
                            <span className="course-name">{exam.courseName}</span>
                        </div>
                    </div>
                </div>

                <div className="header-right">
                    <div className="time-display">
                        <div className="time-label">Time Remaining</div>
                        <div className={`time-value ${timeLeft <= 300 ? 'warning' : ''} ${timeLeft <= 60 ? 'critical' : ''}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <div className="marks-info">
                        <div className="marks-label">Total Marks</div>
                        <div className="marks-value">{exam.totalMarks}</div>
                    </div>
                </div>
            </div>

            {/* Exam Content */}
            <div className="exam-content">
                {/* Question Section */}
                <div className="question-section">
                    <div className="section-header">
                        <h2>Question</h2>
                        <div className="question-marks">
                            <span className="marks-badge">{exam.totalMarks} marks</span>
                        </div>
                    </div>

                    <div className="question-content">
                        <div className="question-text">
                            {exam.description}
                        </div>

                        <div className="answer-section">
                            <div className="answer-header">
                                <h3>Your Answer</h3>
                                <div className="word-counter">
                                    Words: {wordCount}
                                </div>
                            </div>

                            <textarea
                                ref={textareaRef}
                                className="answer-textarea"
                                value={answer}
                                onChange={handleAnswerChange}
                                placeholder="Type your answer here..."
                                rows={15}
                                disabled={submitting || timeExceeded}
                                autoFocus
                            />

                            <div className="textarea-footer">
                                <button
                                    className="save-draft-btn"
                                    onClick={handleSaveDraft}
                                    disabled={submitting || timeExceeded}
                                >
                                    Save Draft
                                </button>
                                <div className="format-tips">
                                    <span className="tip">Tip: You can use Markdown formatting</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions Panel */}
                <div className="instructions-panel">
                    <h3>Exam Instructions</h3>
                    <ul className="instructions-list">
                        <li>• You have {exam.durationMinutes} minutes to complete this exam</li>
                        <li>• Your answer will be automatically saved locally</li>
                        <li>• The exam will auto-submit when time expires</li>
                        <li>• Do not refresh or navigate away from this page</li>
                        <li>• Plagiarism is strictly prohibited</li>
                        <li>• Write your answer clearly and concisely</li>
                    </ul>

                    <div className="time-info">
                        <div className="info-item">
                            <span className="info-label">Started:</span>
                            <span className="info-value">
                                {new Date(submission?.submittedAt || new Date()).toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Time Used:</span>
                            <span className="info-value">{timeTakenRef.current} minutes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
                <div className="action-left">
                    <div className="status-indicator">
                        <div className={`status-dot ${submission?.status === 'IN_PROGRESS' ? 'in-progress' : ''}`}></div>
                        <span className="status-text">
                            {submission?.status === 'IN_PROGRESS' ? 'In Progress' : 'Ready to Submit'}
                        </span>
                    </div>
                </div>

                <div className="action-right">
                    <button
                        className="cancel-btn"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to cancel? Your progress will be lost.')) {
                                navigate('/student/exams');
                            }
                        }}
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button
                        className="submit-exam-btn"
                        onClick={handleSubmit}
                        disabled={submitting || timeExceeded}
                    >
                        {submitting ? 'Submitting...' : 'Submit Exam'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamTaking;
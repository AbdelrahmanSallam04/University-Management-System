import React, { useState, useEffect } from 'react';
import { taPublishingService } from '../services/taPublishingService';

const TAPublishComponent = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [publishType, setPublishType] = useState('assignment');

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        marks: '',
        dueDate: '',
        startTime: '',
        endTime: '',
        examType: 'MIDTERM',
        durationMinutes: ''
    });

    // Fetch TA's courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const coursesData = await taPublishingService.getAssistingCourses();
            setCourses(coursesData);
            if (coursesData.length > 0) {
                setSelectedCourse(coursesData[0].courseId.toString());
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedCourse) {
            setError('Please select a course');
            return;
        }

        const courseId = parseInt(selectedCourse);

        try {
            if (publishType === 'assignment') {
                // Prepare assignment data
                const assignmentData = {
                    title: formData.title,
                    description: formData.description,
                    totalMarks: parseInt(formData.marks),
                    dueDate: `${formData.dueDate}T23:59:59`
                };

                await taPublishingService.publishAssignment(courseId, assignmentData);
                setSuccess('Assignment published successfully!');

            } else {
                // Prepare exam data
                const examData = {
                    title: formData.title,
                    description: formData.description,
                    totalMarks: parseInt(formData.marks),
                    startTime: `${formData.startTime}:00`,
                    endTime: `${formData.endTime}:00`,
                    examType: formData.examType,
                    durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : null
                };

                await taPublishingService.publishExam(courseId, examData);
                setSuccess('Exam published successfully!');
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                marks: '',
                dueDate: '',
                startTime: '',
                endTime: '',
                examType: 'MIDTERM',
                durationMinutes: ''
            });

        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to publish');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner"></div>
                <p>Loading courses...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
                <span style={{ marginRight: '10px' }}>📝</span>
                Publish Course Content
            </h2>

            {error && (
                <div style={{
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    padding: '12px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #ef9a9a'
                }}>
                    ❌ {error}
                </div>
            )}

            {success && (
                <div style={{
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '12px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #a5d6a7'
                }}>
                    ✅ {success}
                </div>
            )}

            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '25px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {/* Course Selection */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#495057'
                    }}>
                        Select Course
                    </label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        disabled={courses.length === 0}
                    >
                        {courses.length === 0 ? (
                            <option value="">No courses available</option>
                        ) : (
                            courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.code} - {course.name}
                                </option>
                            ))
                        )}
                    </select>
                    {courses.length === 0 && (
                        <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '5px' }}>
                            You are not assigned to assist any courses.
                        </p>
                    )}
                </div>

                {/* Content Type Selection */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#495057'
                    }}>
                        Content Type
                    </label>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="radio"
                                value="assignment"
                                checked={publishType === 'assignment'}
                                onChange={(e) => setPublishType(e.target.value)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            📝 Assignment
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="radio"
                                value="exam"
                                checked={publishType === 'exam'}
                                onChange={(e) => setPublishType(e.target.value)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            🎯 Exam
                        </label>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#495057'
                        }}>
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Midterm Project, Quiz 1, Final Exam"
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#495057'
                        }}>
                            Description / Questions
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Enter description or questions here..."
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '16px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Marks */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#495057'
                        }}>
                            {publishType === 'assignment' ? 'Total Marks' : 'Total Marks'}
                        </label>
                        <input
                            type="number"
                            name="marks"
                            value={formData.marks}
                            onChange={handleInputChange}
                            placeholder="100"
                            required
                            min="0"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {/* Dynamic Fields based on Type */}
                    {publishType === 'assignment' ? (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#495057'
                            }}>
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ced4da',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            {/* Exam Start Time */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    color: '#495057'
                                }}>
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            {/* Exam End Time */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    color: '#495057'
                                }}>
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            {/* Exam Type */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    color: '#495057'
                                }}>
                                    Exam Type
                                </label>
                                <select
                                    name="examType"
                                    value={formData.examType}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '16px'
                                    }}
                                >
                                    <option value="MIDTERM">Midterm</option>
                                    <option value="FINAL">Final</option>
                                    <option value="QUIZ">Quiz</option>
                                    <option value="TEST">Test</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* Duration */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    color: '#495057'
                                }}>
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="durationMinutes"
                                    value={formData.durationMinutes}
                                    onChange={handleInputChange}
                                    placeholder="Optional"
                                    min="0"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={courses.length === 0}
                        style={{
                            backgroundColor: courses.length === 0 ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: courses.length === 0 ? 'not-allowed' : 'pointer',
                            width: '100%',
                            marginTop: '10px'
                        }}
                    >
                        {publishType === 'assignment' ? 'Publish Assignment' : 'Publish Exam'}
                    </button>
                </form>
            </div>

            {/* Instructions */}
            <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#e8f4f8',
                borderRadius: '6px',
                border: '1px solid #b8dae4'
            }}>
                <h4 style={{ marginBottom: '10px', color: '#0c5460' }}>
                    📋 Publishing Guidelines
                </h4>
                <ul style={{ color: '#0c5460', paddingLeft: '20px', margin: 0 }}>
                    <li>Only publish for courses you're assigned to assist</li>
                    <li>Double-check dates and times before publishing</li>
                    <li>Published content will be immediately visible to students</li>
                    <li>You can view published materials in the course materials section</li>
                </ul>
            </div>
        </div>
    );
};

export default TAPublishComponent;
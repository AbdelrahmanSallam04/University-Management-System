import React, { useState, useEffect } from 'react';

import '../styles/MaintenanceReportForm.css';
import axios from "axios";

const PublishContentView = ({dashboardData}) => {
    const [formData, setFormData] = useState({
        courseId: '',
        type: 'assignment',
        title: '',
        description: '',
        marks: '',
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
        const url = `/api/publishing/professors/${dashboardData.ID}/courses/${formData.courseId}/${endpointType}`;

        let payload;

        if (formData.type === 'assignment') {
            payload = {
                title: formData.title,
                description: formData.description,
                marks: parseInt(formData.marks),
                dueDate: formData.date + "T00:00:00"
            };
        } else {
            payload = {
                title: formData.title,
                description: formData.description,
                totalMarks: parseInt(formData.marks),
                startTime: formData.startTime + ":00",
                endTime: formData.endTime + ":00",
                examType: formData.examType,
                durationMinutes: parseInt(formData.durationMinutes) || null
            };
        }

        try {
            console.log("in try and catch");
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
            console.log(err);
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

export default PublishContentView;
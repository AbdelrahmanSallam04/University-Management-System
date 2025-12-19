import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfessorGradingPage = ({ gradingType, currentItem, onBackToMaterials }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (currentItem) {
            fetchSubmissions();
        }
    }, [currentItem]);

    const fetchSubmissions = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let endpoint = '';
            let itemId = null;

            // Get the correct ID based on entity type
            if (gradingType === 'assignment') {
                itemId = currentItem.assignmentId || currentItem.id;
                endpoint = `/api/assignments/${itemId}/submissions`;
            } else if (gradingType === 'exam') {
                itemId = currentItem.exam_id || currentItem.id;
                endpoint = `/api/exams/${itemId}/submissions`;
            }

            console.log(`📡 Fetching from: ${endpoint}`);
            const response = await axios.get(endpoint);
            console.log('📊 API Response:', response.data);

   const processedData = response.data.map(item => {
       if (gradingType === 'assignment') {
           return {
               id: item.assignment_submission_id ?? item.assignmentSubmissionId, // submission ID must exist
               assignmentId: item.assignment_id ?? item.assignmentId,
               studentId: item.student_id ?? item.studentId ?? 'Unknown',        // safe fallback
               studentName: item.student_name || `Student ${item.student_id ?? item.studentId ?? 'Unknown'}`,
               submittedAt: item.submittedAt,
               answer: item.answer || '',
               grade: item.grade ?? 0,      // default grade 0
               feedback: item.feedback || '',
               type: 'assignment'
           };
       } else {
           return {
               id: item.examSubmissionId,  // From ExamSubmissionDTO
                            examId: item.examId,        // From ExamSubmissionDTO
                            studentId: item.studentId,  // From ExamSubmissionDTO
                            studentName: item.studentName || `Student ${item.studentId ?? 'Unknown'}`,
                            submittedAt: item.submittedAt,  // From ExamSubmissionDTO
                            answer: item.answers || '',     // Note: "answers" not "answer"
                            score: item.obtainedMarks ?? 0, // Note: "obtainedMarks" not "score"
                            feedback: item.feedback || '',
                            type: 'exam'
           };
       }
   });

            setSubmissions(processedData);
            console.log('✅ Processed data:', processedData);

        } catch (err) {
            console.error('❌ Fetch error:', err);
            setError(`Failed to load submissions: ${err.response?.data || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGrade = async (submissionId, gradeValue, feedbackValue) => {
        setError('');
        setSuccess('');

        try {
            let endpoint = '';
            let payload = {};

            if (gradingType === 'assignment') {
                endpoint = `/api/assignments/submissions/${submissionId}`;
                payload = {
                    grade: parseInt(gradeValue),
                    feedback: feedbackValue
                };
            } else if (gradingType === 'exam') {
                endpoint = `/api/exams/submissions/${submissionId}`;
                payload = {
                    score: parseInt(gradeValue),
                    feedback: feedbackValue
                };
            }

            console.log('💾 Saving to:', endpoint, 'Payload:', payload);
            const response = await axios.put(endpoint, payload);
            console.log('✅ Save response:', response.data);

            // Update local state
            setSubmissions(prev => prev.map(sub => {
                if (sub.id === submissionId) {
                    if (gradingType === 'assignment') {
                        return { ...sub, grade: parseInt(gradeValue), feedback: feedbackValue };
                    } else {
                        return { ...sub, score: parseInt(gradeValue), feedback: feedbackValue };
                    }
                }
                return sub;
            }));

            setSuccess('✅ Grade saved successfully!');
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            console.error('❌ Save error:', err);
            setError(`Failed to save grade: ${err.response?.data || err.message}`);
        }
    };

    const refreshData = () => {
        fetchSubmissions();
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2>📝 Loading {gradingType} submissions...</h2>
                </div>
                <div style={styles.loading}>
                    <div style={styles.spinner}>⏳</div>
                    <p>Loading data from server...</p>
                </div>
            </div>
        );
    }

    const totalMarks = currentItem?.marks || 100;
    const gradeLabel = gradingType === 'assignment' ? 'Grade' : 'Score';

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>📝 Grading: {currentItem?.title || 'Unknown'}</h1>
                    <div style={styles.subtitle}>
                        <span style={styles.subtitleItem}><strong>Total Marks:</strong> {totalMarks}</span>
                        <span style={styles.subtitleItem}><strong>Type:</strong> {gradingType}</span>
                        <span style={styles.subtitleItem}><strong>Submissions:</strong> {submissions.length}</span>
                    </div>
                </div>
                <div style={styles.buttons}>
                    <button style={styles.buttonPrimary} onClick={refreshData}>
                        🔄 Refresh
                    </button>
                    <button style={styles.buttonSecondary} onClick={onBackToMaterials}>
                        ⬅ Back
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div style={styles.error}>
                    ❌ {error}
                </div>
            )}

            {success && (
                <div style={styles.success}>
                    ✅ {success}
                </div>
            )}

            {/* Content */}
            {submissions.length === 0 ? (
                <div style={styles.empty}>
                    <div style={styles.emptyIcon}>📭</div>
                    <h3>No submissions found</h3>
                    <p>No students have submitted this {gradingType} yet.</p>
                    <button style={styles.buttonPrimary} onClick={refreshData}>
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>Student</th>
                                    <th style={styles.th}>Submitted At</th>
                                    <th style={styles.th}>Answer</th>
                                    <th style={styles.th}>Current {gradeLabel}</th>
                                    <th style={styles.th}>New {gradeLabel}</th>
                                    <th style={styles.th}>Feedback</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission, index) => (
                                    <SubmissionRow
                                        key={submission.id}
                                        submission={submission}
                                        index={index}
                                        gradingType={gradingType}
                                        totalMarks={totalMarks}
                                        onSave={handleSaveGrade}
                                        gradeLabel={gradeLabel}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Statistics */}
                    <div style={styles.stats}>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{submissions.length}</div>
                            <div style={styles.statLabel}>Total Submissions</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={{...styles.statValue, color: '#10b981'}}>
                                {submissions.filter(s => s.grade || s.score).length}
                            </div>
                            <div style={styles.statLabel}>Graded</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={{...styles.statValue, color: '#f59e0b'}}>
                                {submissions.filter(s => !s.grade && !s.score).length}
                            </div>
                            <div style={styles.statLabel}>Pending</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Submission Row Component
const SubmissionRow = ({ submission, index, gradingType, totalMarks, onSave, gradeLabel }) => {
    const [grade, setGrade] = useState(submission.grade || submission.score || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        if (grade === '' || isNaN(grade)) {
            alert('Please enter a valid grade');
            return;
        }

        const numericGrade = parseInt(grade);
        if (numericGrade < 0 || numericGrade > totalMarks) {
            alert(`Grade must be between 0 and ${totalMarks}`);
            return;
        }

        setSaving(true);
        onSave(submission.id, numericGrade, feedback)
            .finally(() => setSaving(false));
    };

    const currentGrade = submission.grade || submission.score;
    const hasGrade = currentGrade !== undefined && currentGrade !== null;

    return (
        <tr style={{
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
        }}>
            <td style={styles.td}>
                <div style={{ fontWeight: '600' }}>{submission.studentName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {submission.studentId}</div>
            </td>
            <td style={styles.td}>
                {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}
            </td>
            <td style={styles.td}>
                <div style={styles.answerPreview}>
                    {submission.answer ? `${submission.answer.substring(0, 200)}${submission.answer.length > 200 ? '...' : ''}` : 'No answer'}
                </div>
            </td>
            <td style={styles.td}>
                <span style={{
                    ...styles.gradeBadge,
                    backgroundColor: hasGrade ? '#dcfce7' : '#fef3c7',
                    color: hasGrade ? '#065f46' : '#92400e'
                }}>
                    {hasGrade ? currentGrade : 'Not graded'}
                </span>
            </td>
            <td style={styles.td}>
                <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    min="0"
                    max={totalMarks}
                    placeholder={`0-${totalMarks}`}
                    style={styles.gradeInput}
                />
            </td>
            <td style={styles.td}>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback..."
                    rows="3"
                    style={styles.feedbackInput}
                />
            </td>
            <td style={styles.td}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        ...styles.saveButton,
                        backgroundColor: saving ? '#94a3b8' : '#3b82f6'
                    }}
                >
                    {saving ? 'Saving...' : '💾 Save'}
                </button>
            </td>
        </tr>
    );
};

// Styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #dee2e6'
    },
    title: {
        margin: 0,
        fontSize: '24px',
        color: '#1e40af'
    },
    subtitle: {
        color: '#6c757d',
        marginTop: '5px'
    },
    subtitleItem: {
        marginRight: '20px'
    },
    buttons: {
        display: 'flex',
        gap: '10px'
    },
    buttonPrimary: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    buttonSecondary: {
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    loading: {
        textAlign: 'center',
        padding: '50px'
    },
    spinner: {
        fontSize: '48px',
        marginBottom: '20px'
    },
    error: {
        padding: '10px 15px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderRadius: '5px',
        marginBottom: '15px'
    },
    success: {
        padding: '10px 15px',
        backgroundColor: '#dcfce7',
        color: '#166534',
        borderRadius: '5px',
        marginBottom: '15px'
    },
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#64748b'
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '10px'
    },
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    tableHeader: {
        backgroundColor: '#1e40af',
        color: 'white'
    },
    th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: '600'
    },
    td: {
        padding: '12px',
        verticalAlign: 'top'
    },
    answerPreview: {
        maxHeight: '100px',
        overflowY: 'auto',
        padding: '8px',
        backgroundColor: '#f1f5f9',
        borderRadius: '4px',
        fontSize: '14px',
        maxWidth: '300px'
    },
    gradeBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: '600',
        display: 'inline-block'
    },
    gradeInput: {
        width: '80px',
        padding: '8px',
        border: '2px solid #10b981',
        borderRadius: '4px',
        textAlign: 'center'
    },
    feedbackInput: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    saveButton: {
        padding: '8px 16px',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        fontWeight: '500'
    },
    stats: {
        display: 'flex',
        gap: '20px',
        marginTop: '20px'
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    statValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: '5px'
    },
    statLabel: {
        color: '#6c757d'
    }
};

export default ProfessorGradingPage;
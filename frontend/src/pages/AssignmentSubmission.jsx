import React, { useState, useEffect } from "react";
import Sidebar from "../components/StudentSidebar";
import "../styles/AssignmentSubmission.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AssignmentSubmission = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/assignments/${assignmentId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setAssignment(response.data.assignment);
        if (response.data.assignment.submission) {
          setSubmission(response.data.assignment.submission.submissionText || "");
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assignment:", err);
      setError("Failed to load assignment details. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submission.trim()) {
      alert("Please enter your submission before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const requestData = {
        assignmentId: parseInt(assignmentId),
        submissionText: submission
      };

      const response = await axios.post(
        "http://localhost:8080/api/assignment-submissions/submit",
        requestData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess({
          title: "Success!",
          message: response.data.message,
          type: "submit"
        });

        // Refresh assignment details
        setTimeout(() => {
          fetchAssignmentDetails();
        }, 1500);
      } else {
        setError(response.data.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      if (err.response?.status === 401) {
        setError("Please login to submit assignments");
      } else {
        setError(err.response?.data?.message || "Failed to submit assignment. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!submission.trim()) {
      alert("Please enter your submission before updating.");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const requestData = {
        assignmentId: parseInt(assignmentId),
        submissionText: submission
      };

      const response = await axios.put(
        "http://localhost:8080/api/assignment-submissions/update",
        requestData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess({
          title: "Updated!",
          message: response.data.message,
          type: "update"
        });

        // Refresh assignment details
        setTimeout(() => {
          fetchAssignmentDetails();
        }, 1500);
      } else {
        setError(response.data.message || "Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update submission. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPastDue = () => {
    if (!assignment) return false;
    const dueDate = new Date(assignment.dueDate);
    return new Date() > dueDate;
  };

  const hasExistingSubmission = assignment?.submission;
  const isGraded = assignment?.submission?.marksObtained !== null &&
                   assignment?.submission?.marksObtained > 0;

  if (loading) {
    return (
      <div className="submission-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading assignment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="submission-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h3>Assignment Not Found</h3>
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className="back-button">
              ← Back to Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-wrapper">
      <Sidebar />
      <div className="main-content">
        {/* Success Message */}
        {success && (
          <div className={`success-alert ${success.type}`}>
            <div className="alert-content">
              <span className="alert-icon">
                {success.type === 'submit' ? '✅' : '🔄'}
              </span>
              <div className="alert-text">
                <h4>{success.title}</h4>
                <p>{success.message}</p>
              </div>
            </div>
            <button className="close-alert" onClick={() => setSuccess(null)}>
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              <div className="alert-text">
                <h4>Something went wrong</h4>
                <p>{error}</p>
              </div>
            </div>
            <button className="close-alert" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="submission-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to Assignments
          </button>
          <h1>Assignment Submission</h1>
          {hasExistingSubmission && (
            <div className="submission-status">
              <span className={`status-badge ${assignment.submission.status === 'LATE' ? 'late' : 'submitted'}`}>
                {assignment.submission.status === 'LATE' ? 'Late Submission' : 'Submitted'}
              </span>
            </div>
          )}
        </div>

        {/* Assignment Details */}
        <div className="assignment-details-card">
          <div className="assignment-header">
            <div className="assignment-title-section">
              <h2>{assignment?.title}</h2>
              <div className="course-info">
                <span className="course-code">{assignment?.courseCode}</span>
                <span className="course-name">{assignment?.courseName}</span>
              </div>
            </div>

            <div className="assignment-meta">
              <div className="meta-item">
                <span className="meta-label">Total Marks:</span>
                <span className="meta-value marks">{assignment?.totalMarks}</span>
              </div>
            </div>
          </div>

          <div className="due-date-section">
            <div className="due-date-info">
              <span className="due-date-label">Due Date:</span>
              <span className={`due-date-value ${isPastDue() ? 'past-due' : ''}`}>
                {assignment ? formatDate(assignment.dueDate) : ''}
              </span>
              {isPastDue() && (
                <span className="past-due-warning">⚠️ Past Due</span>
              )}
            </div>

            {!isPastDue() && assignment && (
              <div className="time-remaining">
                <span className="time-label">Time remaining:</span>
                <span className="time-value">
                  {(() => {
                    const now = new Date();
                    const due = new Date(assignment.dueDate);
                    const diffMs = due - now;
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                    if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
                    if (diffHours > 0) return `${diffHours}h`;
                    return "Less than 1h";
                  })()}
                </span>
              </div>
            )}
          </div>

          <div className="description-section">
            <h3>Assignment Description</h3>
            <div className="description-content">
              {assignment?.description ? (
                <p className="assignment-description">{assignment.description}</p>
              ) : (
                <p className="no-description">No description provided for this assignment.</p>
              )}
            </div>
          </div>

          {/* Existing Submission Details */}
          {hasExistingSubmission && (
            <div className="existing-submission">
              <h3>
                <span className="submission-icon">📤</span>
                Your Submission
              </h3>
              <div className="submission-details">
                <div className="submission-meta">
                  <div className="meta-item">
                    <span className="meta-label">Submitted on:</span>
                    <span className="meta-value">
                      {formatDate(assignment.submission.submittedAt)}
                    </span>
                  </div>

                  {assignment.submission.status === 'LATE' && (
                    <div className="meta-item">
                      <span className="meta-label warning">Status:</span>
                      <span className="meta-value warning">Late Submission</span>
                    </div>
                  )}

                  {isGraded && (
                    <div className="meta-item">
                      <span className="meta-label success">Grade:</span>
                      <span className="meta-value success grade">
                        {assignment.submission.marksObtained}/{assignment.totalMarks}
                      </span>
                    </div>
                  )}
                </div>

                {assignment.submission.feedback && (
                  <div className="feedback-section">
                    <h4>Professor's Feedback</h4>
                    <div className="feedback-content">
                      <p className="feedback-text">{assignment.submission.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submission Form */}
        <div className="submission-form">
          <div className="form-header">
            <h3>Your Answer</h3>
            <div className="form-requirements">
              <span className="requirement">
                <span className="requirement-icon">📝</span>
                Write your answer in the text box below
              </span>
            </div>
          </div>

          <div className="form-group">
            <textarea
              className="submission-textarea"
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Type your answer here... Be as detailed as possible."
              rows={12}
              disabled={isGraded}
            />
            <div className="textarea-footer">
              <div className="character-count">
                <span className="count">{submission.length}</span> characters
              </div>
              <div className="word-count">
                <span className="count">{submission.split(/\s+/).filter(word => word.length > 0).length}</span> words
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="cancel-btn"
              onClick={() => navigate(-1)}
              disabled={submitting || updating}
            >
              Cancel
            </button>

            {hasExistingSubmission ? (
              <button
                className="update-btn"
                onClick={handleUpdate}
                disabled={submitting || updating || isGraded}
              >
                {updating ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : isGraded ? (
                  'Already Graded'
                ) : (
                  'Update Submission'
                )}
              </button>
            ) : (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting || updating}
              >
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Assignment'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmission;
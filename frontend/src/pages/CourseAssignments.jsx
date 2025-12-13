import React, { useState, useEffect } from "react";
import Sidebar from "../components/StudentSidebar";
import "../styles/CourseAssignments.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CourseAssignments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "pending", "submitted"

  useEffect(() => {
    fetchCourseAssignments();
    fetchCourseInfo();
  }, [courseId]);

  const fetchCourseAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/assignments/course/${courseId}`,
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data)) {
        setAssignments(response.data);
      } else {
        setAssignments([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Failed to load assignments. Please try again.");
      setLoading(false);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/courses/${courseId}`,
        { withCredentials: true }
      );
      setCourseInfo(response.data);
    } catch (err) {
      console.error("Error fetching course info:", err);
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

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffMs < 0) return "Past due";
    if (diffDays > 0) return `${diffDays}d ${diffHours}h remaining`;
    if (diffHours > 0) return `${diffHours}h remaining`;
    return "Due soon";
  };

  const getStatusBadge = (assignment) => {
    if (assignment.submitted) {
      return (
        <span className="badge submitted">
          <span className="badge-icon">✓</span>
          Submitted
        </span>
      );
    }

    const now = new Date();
    const due = new Date(assignment.dueDate);

    if (now > due) {
      return (
        <span className="badge past-due">
          <span className="badge-icon">⚠</span>
          Past Due
        </span>
      );
    }

    const timeDiff = due - now;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 2) {
      return (
        <span className="badge urgent">
          <span className="badge-icon">⚡</span>
          Due Soon
        </span>
      );
    }

    return (
      <span className="badge active">
        <span className="badge-icon">📝</span>
        Active
      </span>
    );
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === "all") return true;
    if (filter === "pending") return !assignment.submitted;
    if (filter === "submitted") return assignment.submitted;
    return true;
  });

  const pendingCount = assignments.filter(a => !a.submitted).length;
  const submittedCount = assignments.filter(a => a.submitted).length;

  if (loading) {
    return (
      <div className="assignments-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !assignments.length) {
    return (
      <div className="assignments-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={fetchCourseAssignments} className="retry-button">
                Try Again
              </button>
              <button onClick={() => navigate(-1)} className="back-button">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-wrapper">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="assignments-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to Courses
          </button>
          <div className="header-content">
            <h1>
              {courseInfo ? `${courseInfo.code} - ${courseInfo.name}` : 'Course Assignments'}
            </h1>
            <p>View and submit your assignments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card total">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{assignments.length}</div>
              <div className="stat-label">Total Assignments</div>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{pendingCount}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card submitted">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{submittedCount}</div>
              <div className="stat-label">Submitted</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Assignments
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
              onClick={() => setFilter('submitted')}
            >
              Submitted ({submittedCount})
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div className="assignments-container">
          {filteredAssignments.length === 0 ? (
            <div className="no-assignments">
              <div className="empty-state-icon">📝</div>
              <h3>No assignments found</h3>
              <p>
                {filter === 'all'
                  ? 'No assignments have been posted for this course yet.'
                  : filter === 'pending'
                  ? 'All assignments have been submitted! Great work!'
                  : 'No submitted assignments yet.'}
              </p>
            </div>
          ) : (
            <div className="assignments-list">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.assignmentId} className="assignment-card">
                  <div className="assignment-header">
                    <div className="header-left">
                      <h3 className="assignment-title">{assignment.title}</h3>
                      {getStatusBadge(assignment)}
                    </div>
                    <div className="header-right">
                      <span className="assignment-marks">
                        {assignment.totalMarks} points
                      </span>
                    </div>
                  </div>

                  <p className="assignment-description">
                    {assignment.description || "No description provided."}
                  </p>

                  <div className="assignment-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">Due Date:</span>
                        <span className={`detail-value ${new Date() > new Date(assignment.dueDate) ? 'past-due' : ''}`}>
                          {formatDate(assignment.dueDate)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value time-remaining">
                          {getTimeRemaining(assignment.dueDate)}
                        </span>
                      </div>
                    </div>

                    {assignment.submitted && (
                      <div className="detail-row submitted-info">
                        <div className="detail-item">
                          <span className="detail-label">Submitted:</span>
                          <span className="detail-value submitted">
                            {formatDate(assignment.submittedAt)}
                          </span>
                        </div>
                        {assignment.marksObtained !== null && assignment.marksObtained > 0 && (
                          <div className="detail-item">
                            <span className="detail-label">Grade:</span>
                            <span className="detail-value grade">
                              {assignment.marksObtained}/{assignment.totalMarks}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="assignment-actions">
                    <button
                      className="view-assignment-btn"
                      onClick={() => navigate(`/assignment/${assignment.assignmentId}`)}
                    >
                      {assignment.submitted ? 'View Submission' : 'Submit Assignment'}
                    </button>
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

export default CourseAssignments;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParentSidebar from '../components/ParentSidebar';
import axios from 'axios';
import '../styles/ParentDashboard.css';

const ParentDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api';
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/parent');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchChildAssignments = async (studentId) => {
    try {
      const response = await api.get(`/dashboard/parent/assignments/${studentId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching assignments:', err);
      return [];
    }
  };

  const fetchChildGrades = async (studentId) => {
    try {
      const response = await api.get(`/dashboard/parent/grades/${studentId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching grades:', err);
      return [];
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // Updated menu items for ParentSidebar
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'children', label: 'My Children', icon: '👨‍🎓' },
    { id: 'assignments', label: 'Assignments', icon: '📚' },
    { id: 'grades', label: 'Grades', icon: '📝' },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>{error}</h3>
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      );
    }

    if (!dashboardData) {
      return (
        <div className="no-data-container">
          <div className="no-data-icon">📊</div>
          <h3>No data available</h3>
          <p>Please check your connection and try again</p>
        </div>
      );
    }

    switch(currentView) {
      case 'dashboard':
        return (
          <DashboardOverview
            data={dashboardData}
            fetchChildAssignments={fetchChildAssignments}
          />
        );
      case 'children':
        return <MyChildren data={dashboardData} />;
      case 'assignments':
        return <AssignmentsView data={dashboardData} fetchChildAssignments={fetchChildAssignments} />;
      case 'grades':
        return <GradesView data={dashboardData} fetchChildGrades={fetchChildGrades} />;
      default:
        return (
          <DashboardOverview
            data={dashboardData}
            fetchChildAssignments={fetchChildAssignments}
          />
        );
    }
  };

  return (
    <div className="parent-dashboard">
      <ParentSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        menuItems={menuItems}
      />
      <div className="parent-main-content">
        {renderContent()}
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ data, fetchChildAssignments }) => {
  const { stats, children, recentGrades } = data;
  const parentName = localStorage.getItem('userName') || 'Parent';
  const [gradedAssignments, setGradedAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignmentError, setAssignmentError] = useState(null);

  useEffect(() => {
    const fetchGradedAssignments = async () => {
      if (!children || children.length === 0) {
        setGradedAssignments([]);
        setLoadingAssignments(false);
        return;
      }

      try {
        setLoadingAssignments(true);
        setAssignmentError(null);
        const allAssignments = [];

        // Fetch assignments for each child
        for (const child of children) {
          try {
            const assignments = await fetchChildAssignments(child.studentId);

            if (Array.isArray(assignments)) {
              // Filter for graded assignments (those with a grade)
              const graded = assignments.filter(assignment =>
                assignment.grade !== null &&
                assignment.grade !== undefined &&
                assignment.grade !== ''
              );

              console.log(`Found ${graded.length} graded assignments for ${child.firstName}`);

              // Add child info to each assignment
              const assignmentsWithChildInfo = graded.map(assignment => ({
                ...assignment,
                studentName: `${child.firstName} ${child.lastName}`,
                studentId: child.studentId,
                childFirstName: child.firstName,
                childLastName: child.lastName
              }));

              allAssignments.push(...assignmentsWithChildInfo);
            }
          } catch (err) {
            console.error(`Error fetching assignments for ${child.firstName}:`, err);
            setAssignmentError(`Failed to load assignments for ${child.firstName}`);
          }
        }

        // Sort by submission date or graded date (most recent first)
        const sortedAssignments = allAssignments.sort((a, b) => {
          const dateA = new Date(a.gradedAt || a.submittedAt || a.updatedAt || 0);
          const dateB = new Date(b.gradedAt || b.submittedAt || b.updatedAt || 0);
          return dateB - dateA;
        });

        console.log('Total graded assignments found:', sortedAssignments.length);
        console.log('Graded assignments data:', sortedAssignments);

        setGradedAssignments(sortedAssignments);
      } catch (error) {
        console.error('Error fetching graded assignments:', error);
        setAssignmentError('Failed to load graded assignments');
        setGradedAssignments([]);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchGradedAssignments();
  }, [children, fetchChildAssignments]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  // Function to get grade letter
  const getGradeLetter = (marks) => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    if (marks >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, {parentName}!</h1>
          <p className="welcome-subtitle">Here's an overview of your children's academic progress</p>
        </div>
        <div className="welcome-avatar">
          <span className="avatar-icon">👨‍👩‍👧‍👦</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue-card">
          <div className="stat-icon">
            👨‍🎓
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats?.childrenCount || children?.length || 0}</h3>
            <p className="stat-label">Children Enrolled</p>
            <span className="stat-trend active">Active</span>
          </div>
        </div>

        <div className="stat-card green-card">
          <div className="stat-icon">
            📈
          </div>
          <div className="stat-content">
            <h3 className="stat-number">3.5</h3>
            <p className="stat-label">Average GPA</p>
            <span className="stat-trend up">+2.5%</span>
          </div>
        </div>

        <div className="stat-card purple-card">
          <div className="stat-icon">
            📝
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{gradedAssignments.length}</h3>
            <p className="stat-label">Graded Assignments</p>
            <span className="stat-trend updated">Updated</span>
          </div>
        </div>
      </div>

      {/* Children Performance Section */}
      {children && children.length > 0 && (
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">👨‍🎓</span>
              Children's Performance
            </h2>
          </div>

          <div className="children-grid">
            {children.map((child, index) => (
              <ChildPerformanceCard key={index} child={child} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="activity-grid">
        {/* Graded Assignments Card */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <span className="activity-card-icon">✅</span>
              Recently Graded Assignments
            </h3>
            <span className="activity-card-badge">
              {loadingAssignments ? 'Loading...' : `${gradedAssignments.length} graded`}
            </span>
          </div>
          <div className="activity-card-content">
            {loadingAssignments ? (
              <div className="loading-assignments">
                <div className="small-spinner"></div>
                <p>Loading assignments...</p>
              </div>
            ) : assignmentError ? (
              <div className="no-activity">
                <div className="no-activity-icon">⚠️</div>
                <h4>Error Loading Assignments</h4>
                <p className="no-activity-text">{assignmentError}</p>
              </div>
            ) : gradedAssignments.length > 0 ? (
              <div className="assignments-list">
                {gradedAssignments.slice(0, 4).map((assignment, index) => {
                  const grade = assignment.grade || 0;
                  const gradeColor = getGradeColor(grade);

                  return (
                    <div key={`${assignment.assignmentId || assignment.id}-${index}`} className="assignment-item">
                      <div className="assignment-icon">
                        {grade >= 90 ? '🏆' : grade >= 80 ? '✅' : '📄'}
                      </div>
                      <div className="assignment-info">
                        <div className="assignment-header">
                          <h4 className="assignment-title">
                            {assignment.assignmentTitle || assignment.title || 'Assignment'}
                          </h4>
                          <span className="assignment-date">
                            {formatDate(assignment.gradedAt || assignment.submittedAt)}
                          </span>
                        </div>
                        <div className="assignment-details">
                          <span className="assignment-student">
                            👤 {assignment.childFirstName || assignment.studentName || 'Student'}
                          </span>
                          {assignment.courseName && (
                            <span className="assignment-course">
                              📚 {assignment.courseName}
                            </span>
                          )}
                        </div>
                        {assignment.feedback && (
                          <div className="assignment-feedback-preview" title={assignment.feedback}>
                            💬 {assignment.feedback.length > 30
                              ? assignment.feedback.substring(0, 30) + '...'
                              : assignment.feedback}
                          </div>
                        )}
                      </div>
                      <div className="assignment-grade">
                        <span className={`grade-badge ${gradeColor}`}>
                          {grade}/100
                        </span>
                        <span className="grade-letter">
                          {getGradeLetter(grade)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-activity">
                <div className="no-activity-icon">📝</div>
                <h4>No Graded Assignments Yet</h4>
                <p className="no-activity-text">
                  Assignments will appear here once they are graded by teachers
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Grades Card */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <span className="activity-card-icon">📝</span>
              Recent Exam Grades
            </h3>
            <span className="activity-card-badge">Latest</span>
          </div>
          <div className="activity-card-content">
            {recentGrades && recentGrades.length > 0 ? (
              <div className="grades-list">
                {recentGrades.slice(0, 4).map((grade, index) => {
                  const marks = grade.obtainedMarks || 0;
                  const gradeColor = getGradeColor(marks);

                  return (
                    <div key={index} className="grade-item">
                      <div className="grade-icon">
                        {marks >= 90 ? '🏆' : marks >= 80 ? '📊' : '📝'}
                      </div>
                      <div className="grade-info">
                        <div className="grade-header">
                          <h4 className="grade-course">{grade.examName || 'Exam'}</h4>
                          <span className="grade-date">
                            {formatDate(grade.submittedAt)}
                          </span>
                        </div>
                        <div className="grade-details">
                          <span className="grade-student">
                            👤 {grade.studentName || 'Student'}
                          </span>
                        </div>
                      </div>
                      <div className="grade-score">
                        <span className={`score-badge ${gradeColor}`}>
                          {marks}/100
                        </span>
                        <span className="grade-letter">
                          {getGradeLetter(marks)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-activity">
                <div className="no-activity-icon">📊</div>
                <h4>No Recent Exam Grades</h4>
                <p className="no-activity-text">
                  Exam grades will appear here once available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for grade colors
const getGradeColor = (marks) => {
  if (marks >= 90) return 'excellent';
  if (marks >= 80) return 'good';
  if (marks >= 70) return 'average';
  if (marks >= 60) return 'below-average';
  return 'poor';
};

// Child Performance Card Component
const ChildPerformanceCard = ({ child }) => {
  // Hardcoded GPA values for demonstration
  const hardcodedGPA = {
    'S001': 3.8,
    'S002': 3.2,
    'S003': 3.9,
    'S004': 3.5
  };

  const gpa = hardcodedGPA[child.studentId] || 3.5;
  const progressPercentage = gpa ? (gpa / 4.0 * 100) : 0;

  return (
    <div className="child-card">
      <div className="child-card-header">
        <div className="child-avatar">
          <span className="avatar-initial">{child.firstName?.charAt(0) || 'S'}</span>
        </div>
        <div className="child-info">
          <h3 className="child-name">{child.firstName} {child.lastName}</h3>
          <p className="child-details">{child.gradeLevel || 'Grade'} • Student</p>
        </div>
        <div className="child-gpa">
          <span className="gpa-badge">{gpa?.toFixed(1) || '3.5'}</span>
          <span className="gpa-label">GPA</span>
        </div>
      </div>

      <div className="child-stats">
        <div className="child-stat">
          <span className="stat-label">Student ID</span>
          <span className="stat-value">{child.studentId || 'N/A'}</span>
        </div>
        <div className="child-stat">
          <span className="stat-label">Progress</span>
          <span className="stat-value">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span className="progress-text">Academic Progress</span>
          <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
        </div>
      </div>
    </div>
  );
};

// My Children Component
const MyChildren = ({ data }) => {
  const { children } = data;

  // Hardcoded GPA values
  const hardcodedGPA = {
    'S001': 3.8,
    'S002': 3.2,
    'S003': 3.9,
    'S004': 3.5
  };

  return (
    <div className="children-container">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">👨‍🎓</span>
          My Children
        </h1>
        <p className="page-subtitle">View and manage your children's profiles and academic information</p>
      </div>

      <div className="children-list">
        {children && children.length > 0 ? (
          children.map((child, index) => {
            const gpa = hardcodedGPA[child.studentId] || 3.5;

            return (
              <div key={index} className="child-profile-card">
                <div className="profile-card-header">
                  <div className="profile-avatar">
                    <span className="profile-avatar-initial">
                      {child.firstName?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div className="profile-info">
                    <h3 className="profile-name">{child.firstName} {child.lastName}</h3>
                    <p className="profile-id">Student ID: {child.studentId || 'N/A'}</p>
                  </div>
                  <div className="profile-status">
                    <span className="status-dot active"></span>
                    <span className="status-text">Active</span>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">
                        <span className="detail-icon">👤</span>
                        Grade Level
                      </span>
                      <span className="detail-value">B+</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">
                        <span className="detail-icon">📧</span>
                        Email
                      </span>
                      <span className="detail-value">{child.email || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">
                        <span className="detail-icon">📈</span>
                        Current GPA
                      </span>
                      <span className="detail-value gpa-highlight">{gpa.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">
                        <span className="detail-icon">🎓</span>
                        Status
                      </span>
                      <span className="detail-value status-active">Active Student</span>
                    </div>
                  </div>
                </div>


              </div>
            );
          })
        ) : (
          <div className="no-children">
            <div className="no-children-icon">👨‍👩‍👧‍👦</div>
            <h3>No children found</h3>
            <p>Add your children to start tracking their academic progress</p>
            <button className="add-child-btn">
              <span>+</span> Add Child
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Assignments View Component
const AssignmentsView = ({ data, fetchChildAssignments }) => {
  const [childAssignments, setChildAssignments] = useState({});
  const [loading, setLoading] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const { children } = data;

  useEffect(() => {
    if (children) {
      children.forEach(async (child) => {
        setLoading(prev => ({ ...prev, [child.studentId]: true }));
        const assignments = await fetchChildAssignments(child.studentId);
        setChildAssignments(prev => ({
          ...prev,
          [child.studentId]: assignments
        }));
        setLoading(prev => ({ ...prev, [child.studentId]: false }));
      });
    }
  }, [children, fetchChildAssignments]);

  // Filter assignments based on status
  const filterAssignments = (assignments) => {
    if (!assignments) return [];

    switch(activeFilter) {
      case 'pending':
        return assignments.filter(a => !a.submittedAt || a.grade === null);
      case 'submitted':
        return assignments.filter(a => a.submittedAt && a.grade === null);
      case 'graded':
        return assignments.filter(a => a.grade !== null);
      default:
        return assignments;
    }
  };

  return (
    <div className="assignments-container">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">📚</span>
          Assignments
        </h1>
        <p className="page-subtitle">Track assignment submissions, grades, and deadlines</p>
      </div>

      <div className="assignments-list-container">
        {children && children.length > 0 ? (
          children.map((child) => {
            const assignments = filterAssignments(childAssignments[child.studentId]);
            const isLoading = loading[child.studentId];

            return (
              <div key={child.studentId} className="child-assignments-section">
                <div className="child-section-header">
                  <div className="child-section-title">
                    <h3>{child.firstName}'s Assignments</h3>
                    <span className="assignment-count">{assignments?.length || 0} assignments</span>
                  </div>
                  {isLoading && <div className="loading-spinner small"></div>}
                </div>

                {assignments?.length > 0 ? (
                  <div className="assignments-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Assignment</th>
                          <th>Student</th>
                          <th>Submitted On</th>
                          <th>Grade</th>
                          <th>Status</th>
                          <th>Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((assignment, index) => (
                          <tr key={index}>
                            <td className="assignment-cell">
                              <div className="assignment-title">
                                <span className="assignment-icon">📄</span>
                                <span>{assignment.assignmentTitle || 'Assignment'}</span>
                              </div>
                            </td>
                            <td className="student-cell">
                              <div className="student-info-small">
                                <span className="student-avatar-small">
                                  {child.firstName?.charAt(0) || 'S'}
                                </span>
                                <span>{child.firstName} {child.lastName}</span>
                              </div>
                            </td>
                            <td className="date-cell">
                              {assignment.submittedAt
                                ? new Date(assignment.submittedAt).toLocaleDateString()
                                : 'Not Submitted'}
                            </td>
                            <td className="grade-cell">
                              {assignment.grade !== null ? (
                                <span className={`grade-badge ${getGradeColor(assignment.grade)}`}>
                                  {assignment.grade}/100
                                </span>
                              ) : (
                                <span className="grade-pending">Pending</span>
                              )}
                            </td>
                            <td className="status-cell">
                              <span className={`status-indicator ${
                                assignment.grade !== null ? 'graded' :
                                assignment.submittedAt ? 'submitted' : 'pending'
                              }`}>
                                {assignment.grade !== null ? 'Graded' :
                                 assignment.submittedAt ? 'Submitted' : 'Pending'}
                              </span>
                            </td>
                            <td className="feedback-cell">
                              <div className="feedback-content">
                                {assignment.feedback ? (
                                  <>
                                    <span className="feedback-text">{assignment.feedback}</span>
                                    <button className="feedback-btn">View</button>
                                  </>
                                ) : (
                                  <span className="no-feedback">No feedback yet</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-assignments">
                    <div className="no-assignments-icon">📚</div>
                    <p>No assignments found {activeFilter !== 'all' && `for ${activeFilter} filter`}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-children-assignments">
            <div className="no-children-icon">👨‍👩‍👧‍👦</div>
            <h3>No children found</h3>
            <p>Add children to view their assignments</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Grades View Component
const GradesView = ({ data, fetchChildGrades }) => {
  const [childGrades, setChildGrades] = useState({});
  const [loading, setLoading] = useState({});
  const { children } = data;

  useEffect(() => {
    if (children) {
      children.forEach(async (child) => {
        setLoading(prev => ({ ...prev, [child.studentId]: true }));
        const grades = await fetchChildGrades(child.studentId);
        setChildGrades(prev => ({
          ...prev,
          [child.studentId]: grades
        }));
        setLoading(prev => ({ ...prev, [child.studentId]: false }));
      });
    }
  }, [children, fetchChildGrades]);

  // Hardcoded GPA values
  const hardcodedGPA = {
    'S001': 3.8,
    'S002': 3.2,
    'S003': 3.9,
    'S004': 3.5
  };

  // Get grade letter
  const getGradeLetter = (marks) => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    if (marks >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="grades-container">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">📝</span>
          Exam Grades
        </h1>
        <p className="page-subtitle">View exam results and overall academic performance</p>
      </div>

      {/* GPA Summary */}
      {children && children.length > 0 && (
        <div className="gpa-summary">
          {children.map((child) => {
            const gpa = hardcodedGPA[child.studentId] || 3.5;

            return (
              <div key={child.studentId} className="gpa-card">
                <div className="gpa-card-header">
                  <div className="student-avatar">
                    <span className="avatar-initial">{child.firstName?.charAt(0) || 'S'}</span>
                  </div>
                  <div className="student-info">
                    <h3>{child.firstName} {child.lastName}</h3>
                    <p>{child.gradeLevel || 'Grade'} • Student</p>
                  </div>
                </div>
                <div className="gpa-card-content">
                  <div className="gpa-display">
                    <div className="gpa-circle">
                      <span className="gpa-value">{gpa.toFixed(2)}</span>
                      <span className="gpa-label">GPA</span>
                    </div>
                    <div className="gpa-stats">
                      <div className="gpa-stat">
                        <span className="stat-label">Student ID</span>
                        <span className="stat-value">{child.studentId}</span>
                      </div>
                      <div className="gpa-stat">
                        <span className="stat-label">Grade Level</span>
                        <span className="stat-value">B+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grades Table */}
      <div className="grades-table-container">
        {children && children.length > 0 ? (
          children.map((child) => {
            const grades = childGrades[child.studentId] || [];
            const isLoading = loading[child.studentId];

            return (
              <div key={child.studentId} className="child-grades-section">
                <div className="child-section-header">
                  <div className="child-section-title">
                    <h3>{child.firstName}'s Exam Results</h3>
                    <span className="grades-count">{grades.length} exams</span>
                  </div>
                  {isLoading && <div className="loading-spinner small"></div>}
                </div>

                {grades.length > 0 ? (
                  <div className="grades-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Exam</th>
                          <th>Student</th>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Grade</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((exam, index) => (
                          <tr key={index}>
                            <td className="exam-cell">
                              <div className="exam-title">
                                <span className="exam-icon">📄</span>
                                <span>{exam.examName || 'Exam'}</span>
                              </div>
                            </td>
                            <td className="student-cell">
                              <div className="student-info-small">
                                <span className="student-avatar-small">
                                  {child.firstName?.charAt(0) || 'S'}
                                </span>
                                <span>{child.firstName} {child.lastName}</span>
                              </div>
                            </td>
                            <td className="date-cell">
                              {exam.submittedAt
                                ? new Date(exam.submittedAt).toLocaleDateString()
                                : 'N/A'}
                            </td>
                            <td className="score-cell">
                              <span className={`score-display ${getGradeColor(exam.obtainedMarks)}`}>
                                {exam.obtainedMarks || 0}/100
                              </span>
                            </td>
                            <td className="grade-cell">
                              <span className={`grade-letter ${getGradeColor(exam.obtainedMarks)}`}>
                                {getGradeLetter(exam.obtainedMarks || 0)}
                              </span>
                            </td>
                            <td className="status-cell">
                              <span className={`status-indicator ${exam.status?.toLowerCase() || 'completed'}`}>
                                {exam.status || 'Completed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-grades">
                    <div className="no-grades-icon">📊</div>
                    <h3>No exam grades found</h3>
                    <p>{child.firstName} hasn't taken any exams yet</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-children-grades">
            <div className="no-children-icon">👨‍👩‍👧‍👦</div>
            <h3>No children found</h3>
            <p>Add children to view their grades</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
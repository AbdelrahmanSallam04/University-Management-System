import React, { useState, useEffect } from "react";
import Sidebar from "./StudentSidebar";
import RegistrationModal from "./RegistrationModal";
import RegistrationStatus from "./RegistrationStatus"; // Add this import
import "../styles/CoursesCatalog.css";
import "../styles/RegistrationStatus.css"; // Add this import if not already
import axios from "axios";

const CoursesCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    courseType: "",
    department: ""
  });
  const [filterOptions, setFilterOptions] = useState({
    courseTypes: [],
    departments: []
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Registration status state
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchRegistrationStatus();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/courses", {
        withCredentials: true
      });

      if (response.data && Array.isArray(response.data)) {
        setCourses(response.data);

        const courseTypes = [...new Set(response.data.map(course => course.courseType).filter(Boolean))].sort();
        const departments = [...new Set(response.data.map(course => course.departmentName).filter(Boolean))].sort();

        setFilterOptions({ courseTypes, departments });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
      setLoading(false);
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      setStatusLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/registration/status",
        { withCredentials: true }
      );

      if (response.data.success) {
        setRegistrationStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error fetching registration status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  // Open modal with course details
  const handleRegisterClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  // Handle confirmation from modal
  const handleConfirmRegistration = async (courseId, courseCode) => {
    try {
      setRegistering(true);

      const requestData = {
        courseId: courseId
      };

      const response = await axios.post(
        "http://localhost:8080/api/registration/register",
        requestData,
        {
          withCredentials: true
        }
      );

      const result = response.data;

      if (result.success) {
        setSuccessMessage({
          courseCode: result.courseCode,
          courseName: result.courseName,
          message: result.message
        });

        // Close modal
        setModalOpen(false);
        setSelectedCourse(null);

        // Refresh both courses and registration status
        fetchCourses();
        fetchRegistrationStatus();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.status === 401) {
        alert("❌ Please login to register for courses");
      } else {
        const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
        alert(`❌ ${errorMsg}`);
      }
    } finally {
      setRegistering(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    if (!registering) {
      setModalOpen(false);
      setSelectedCourse(null);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    if (!course) return false;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (course.name && course.name.toLowerCase().includes(searchLower)) ||
      (course.code && course.code.toLowerCase().includes(searchLower));

    const matchesCourseType = !filters.courseType || course.courseType === filters.courseType;
    const matchesDepartment = !filters.department || course.departmentName === filters.department;

    return matchesSearch && matchesCourseType && matchesDepartment;
  });

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      courseType: "",
      department: ""
    });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="catalog-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="error-section">
            <p>{error}</p>
            <button onClick={fetchCourses} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-wrapper">
      <Sidebar />
      <div className="main-content">
        {/* Success Message */}
        {successMessage && (
          <div className="success-alert">
            <div className="alert-content">
              <span className="alert-icon">✅</span>
              <span className="alert-message">
                Successfully registered for {successMessage.courseCode}! {successMessage.message}
              </span>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        <RegistrationModal
          course={selectedCourse}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmRegistration}
          isRegistering={registering}
        />

        {/* Header */}
        <div className="catalog-header">
          <div className="header-content">
            <h1>Course Catalog</h1>
            <p>Browse and register for courses</p>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Registration Status Component - ADDED HERE */}
        {!statusLoading && registrationStatus && (
          <div className="registration-status-section">
            <RegistrationStatus />
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Course Type</label>
              <select
                value={filters.courseType}
                onChange={(e) => handleFilterChange('courseType', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {filterOptions.courseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {filterOptions.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>

        {/* Results */}
        <div className="results-count">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>

        {/* Courses Grid */}
        <div className="courses-container">
          {filteredCourses.length === 0 ? (
            <div className="no-courses">
              <p>No courses found matching your criteria.</p>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <div key={course.courseId} className="course-card">
                  <div className="course-header">
                    <div className="header-left">
                      <h3 className="course-code">{course.code}</h3>
                      <span className="credit-hours">
                        {course.creditHours} Credits
                      </span>
                    </div>
                  </div>

                  <h4 className="course-name">{course.name}</h4>
                  <p className="course-description">{course.description}</p>

                  <div className="course-details">
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{course.courseType || "N/A"}</span>
                    </div>
                    {course.departmentName && (
                      <div className="detail-item">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value">{course.departmentName}</span>
                      </div>
                    )}
                    {course.professorName && (
                      <div className="detail-item">
                        <span className="detail-label">Professor:</span>
                        <span className="detail-value">{course.professorName}</span>
                      </div>
                    )}
                  </div>

                  {/* Register Button - Opens Modal */}
                  <button
                    className="register-btn"
                    onClick={() => handleRegisterClick(course)}
                  >
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesCatalog;
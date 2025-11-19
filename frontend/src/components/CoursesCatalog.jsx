import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./StudentSidebar";
import "../styles/CoursesCatalog.css";
import axios from "axios";

const CoursesCatalog = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/courses"); // localhost: server port (default 8080) but it is not running with me

      if (response.data && Array.isArray(response.data)) {
        setCourses(response.data);

        // Extract filter options from courses data
        const courseTypes = [...new Set(response.data.map(course => course.courseType).filter(Boolean))].sort();
        const departments = [...new Set(response.data.map(course => course.departmentName).filter(Boolean))].sort();

        setFilterOptions({
          courseTypes,
          departments
        });
      } else {
        setCourses([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
      setLoading(false);
    }
  };

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

  const filteredCourses = courses.filter(course => {
    if (!course) return false;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (course.name && course.name.toLowerCase().includes(searchLower)) ||
      (course.code && course.code.toLowerCase().includes(searchLower)) ||
      (course.description && course.description.toLowerCase().includes(searchLower));

    const matchesCourseType = !filters.courseType || course.courseType === filters.courseType;
    const matchesDepartment = !filters.department || course.departmentName === filters.department;

    return matchesSearch && matchesCourseType && matchesDepartment;
  });

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
        {/* Header Section */}
        <div className="catalog-header">
          <div className="header-content">
            <h1>Course Catalog</h1>
            <p>Browse all available courses</p>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="courseType" className="filter-label">Course Type</label>
              <select
                id="courseType"
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
              <label htmlFor="department" className="filter-label">Department</label>
              <select
                id="department"
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

          {/* Active Filters Display */}
          {(filters.courseType || filters.department || searchTerm) && (
            <div className="active-filters">
              <span className="active-filters-label">Active filters:</span>
              {filters.courseType && (
                <span className="filter-tag">
                  Type: {filters.courseType}
                  <button onClick={() => handleFilterChange('courseType', '')}>×</button>
                </span>
              )}
              {filters.department && (
                <span className="filter-tag">
                  Department: {filters.department}
                  <button onClick={() => handleFilterChange('department', '')}>×</button>
                </span>
              )}
              {searchTerm && (
                <span className="filter-tag">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
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
                    <h3 className="course-code">{course.code}</h3>
                    <span className="credit-hours">
                      {course.creditHours} Credits
                    </span>
                  </div>
                  <h4 className="course-name">{course.name}</h4>
                  <p className="course-description">
                    {course.description}
                  </p>

                  <div className="course-details">
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value course-type-badge">
                        {course.courseType}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{course.departmentName || "Not specified"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Professor:</span>
                      <span className="detail-value">
                        {course.professorName}
                      </span>
                    </div>
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

export default CoursesCatalog;
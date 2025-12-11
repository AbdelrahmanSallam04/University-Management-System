import React, { useState, useEffect } from 'react';

const UserForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    password: initialData.password || '',
    role: initialData.role || 'student',
    phone: initialData.phone || '',
    department: initialData.department || ''
  });

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState(null);

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const response = await fetch('/api/departments');

        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.status}`);
        }

        const data = await response.json();

        // Handle both arrays of objects and arrays of strings
        let processedDepartments;
        processedDepartments = data.map(dept => {
          if (typeof dept === 'object') return dept.departmentName;
          return dept;
        });

        setDepartments(processedDepartments);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError(err.message);

      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getRoleIcon = (role) => {
    const icons = {
      student: '🎓',
      assistant: '👨‍🏫',
      professor: '💼',
      admin: '⚙️',
      parent: '👤'
    };
    return icons[role] || '👤';
  };

  return (
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h3>Personal Information</h3>
          </div>
          <div className="form-row">
            <div className="form-group icon-input">
              <label>👤 First Name *</label>
              <div className="input-with-icon">
                <span className="input-icon">✍️</span>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                />
              </div>
            </div>
            <div className="form-group icon-input">
              <label>📝 Last Name *</label>
              <div className="input-with-icon">
                <span className="input-icon">📋</span>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">🔐</span>
            <h3>Security Information</h3>
          </div>
          <div className="form-group icon-input">
            <label>📧 Email Address *</label>
            <div className="input-with-icon">
              <span className="input-icon">📮</span>
              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@university.edu"
                  required
              />
            </div>
          </div>
          <div className="form-group icon-input">
            <label>🔑 Password *</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">🎯</span>
            <h3>Role & Department</h3>
          </div>
          <div className="form-row">
            <div className="form-group icon-input">
              <label>🎭 User Role *</label>
              <div className="input-with-icon">
                <span className="input-icon">{getRoleIcon(formData.role)}</span>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="role-select"
                >
                  <option value="student">🎓 Student</option>
                  <option value="assistant">👨‍🏫 Assistant</option>
                  <option value="professor">💼 Professor</option>
                  <option value="admin">⚙️ Admin</option>
                  <option value="parent">👤️ Parent</option>
                </select>
              </div>
            </div>
            <div className="form-group icon-input">
              <label>🏫 Department *</label>
              <div className="input-with-icon">
                <span className="input-icon">🏫</span>
                <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="department-select"
                    disabled={loadingDepartments}
                >
                  <option value="">
                    {loadingDepartments ? 'Loading departments...' : 'Select Department'}
                  </option>
                  {error && <option value="">Error loading departments</option>}
                  {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                  ))}
                </select>
                {loadingDepartments && (
                    <div className="loading-indicator">
                      <span className="spinner">⏳</span>
                    </div>
                )}
              </div>
              {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">📞</span>
            <h3>Contact Information</h3>
          </div>
          <div className="form-group icon-input">
            <label>📞 Phone Number</label>
            <div className="input-with-icon">
              <span className="input-icon">📱</span>
              <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            <span className="button-icon">✨</span>
            {initialData.id ? '🔄 Update User' : '🚀 Create Account'}
            <span className="button-sparkle">⭐</span>
          </button>
        </div>

        <div className="form-footer">
          <div className="form-tips">
            <span className="tip-icon">💡</span>
            <span>All fields marked with * are required</span>
          </div>
        </div>
      </form>
  );
};

export default UserForm;
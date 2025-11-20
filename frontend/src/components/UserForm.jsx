import React, { useState } from 'react';

const UserForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    password: initialData.password || '',
    role: initialData.role || 'student',
    phone: initialData.phone || '',
    department: initialData.department || 'Computer '
  });

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
      faculty: '👨‍🏫',
      staff: '💼',
      admin: '⚙️'
    };
    return icons[role] || '👤';
  };

  const departments = [
    'Computer', 'Mathematics', 'Physics', 'Chemistry',
   'Humanities','Mechanics'
  ];

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
                <option value="faculty">👨‍🏫 Faculty</option>
                <option value="staff">💼 Staff</option>
                <option value="admin">⚙️ Admin</option>
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
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
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
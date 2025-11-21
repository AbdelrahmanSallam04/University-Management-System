import React, { useState } from 'react';

const AnnouncementForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    priority: initialData.priority || 'normal',
    targetAudience: initialData.targetAudience || 'all'
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

  return (
    <form onSubmit={handleSubmit} className="announcement-form">
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Content *</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="6"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Target Audience</label>
          <select
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
          >
            <option value="all">All Users</option>
            <option value="students">Students Only</option>
            <option value="faculty">Faculty Only</option>
            <option value="staff">Staff Only</option>
          </select>
        </div>
      </div>

      <button type="submit" className="submit-button">
        {initialData.id ? 'Update Announcement' : 'Create Announcement'}
      </button>
    </form>
  );
};

export default AnnouncementForm;
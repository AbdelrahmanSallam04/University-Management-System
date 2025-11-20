import React, { useState } from 'react';
import AnnouncementForm from '../components/AnnouncementForm';
import '../styles/AnnouncementsManagement.css';

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: 'University Holiday', 
      content: 'The university will be closed on December 25th for Christmas holiday.', 
      priority: 'high', 
      targetAudience: 'all',
      createdAt: '2024-12-01'
    },
    { 
      id: 2, 
      title: 'Registration Deadline', 
      content: 'Last day for course registration is December 10th. Please complete your registration before the deadline.', 
      priority: 'normal', 
      targetAudience: 'students',
      createdAt: '2024-12-02'
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const handleCreateAnnouncement = (announcementData) => {
    const newAnnouncement = {
      id: announcements.length + 1,
      ...announcementData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setShowForm(false);
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleUpdateAnnouncement = (announcementData) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === editingAnnouncement.id ? 
      { ...announcement, ...announcementData } : announcement
    ));
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const handleDeleteAnnouncement = (announcementId) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId));
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: '🔵',
      normal: '🟢',
      high: '🟡',
      urgent: '🔴'
    };
    return icons[priority] || '🟢';
  };

  const getAudienceIcon = (audience) => {
    const icons = {
      all: '👥',
      students: '🎓',
      faculty: '👨‍🏫',
      staff: '👔'
    };
    return icons[audience] || '👥';
  };

  return (
    <div className="announcements-management">
      <div className="page-header">
        <h1>Announcements Management</h1>
        <button 
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          📢 Create Announcement
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAnnouncement(null);
                }}
              >
                ✕
              </button>
            </div>
            <AnnouncementForm
              onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
              initialData={editingAnnouncement || {}}
            />
          </div>
        </div>
      )}

      <div className="announcements-list">
        {announcements.map(announcement => (
          <div key={announcement.id} className={`announcement-card priority-${announcement.priority}`}>
            <div className="announcement-header">
              <div className="announcement-meta">
                <span className="priority-icon">
                  {getPriorityIcon(announcement.priority)}
                </span>
                <span className="audience-icon">
                  {getAudienceIcon(announcement.targetAudience)}
                </span>
                <span className="announcement-date">
                  {announcement.createdAt}
                </span>
              </div>
              <div className="announcement-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEditAnnouncement(announcement)}
                >
                  ✏️
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
            <h3 className="announcement-title">{announcement.title}</h3>
            <p className="announcement-content">{announcement.content}</p>
            <div className="announcement-footer">
              <span className={`priority-badge priority-${announcement.priority}`}>
                {announcement.priority}
              </span>
              <span className="audience-badge">
                For: {announcement.targetAudience}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsManagement;
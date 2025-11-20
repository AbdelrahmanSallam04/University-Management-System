import React, { useState } from 'react';
import EventForm from '../components/EventForm';
import '../styles/EventsManagement.css';

const EventsManagement = () => {
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Career Fair 2024', 
      description: 'Annual career fair with top companies', 
      date: '2024-12-15', 
      time: '10:00', 
      location: 'Main Hall', 
      category: 'academic' 
    },
    { 
      id: 2, 
      title: 'Basketball Tournament', 
      description: 'Inter-department basketball competition', 
      date: '2024-12-20', 
      time: '14:00', 
      location: 'Sports Complex', 
      category: 'sports' 
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      id: events.length + 1,
      ...eventData
    };
    setEvents([...events, newEvent]);
    setShowForm(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleUpdateEvent = (eventData) => {
    setEvents(events.map(event => 
      event.id === editingEvent.id ? { ...event, ...eventData } : event
    ));
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      academic: '📚',
      sports: '⚽',
      cultural: '🎭',
      social: '🎉'
    };
    return icons[category] || '📅';
  };

  return (
    <div className="events-management">
      <div className="page-header">
        <h1>Events Management</h1>
        <button 
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          📅 Add New Event
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }}
              >
                ✕
              </button>
            </div>
            <EventForm
              onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
              initialData={editingEvent || {}}
            />
          </div>
        </div>
      )}

      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <span className="event-category-icon">
                {getCategoryIcon(event.category)}
              </span>
              <h3>{event.title}</h3>
              <span className={`category-badge category-${event.category}`}>
                {event.category}
              </span>
            </div>
            <div className="event-description">
              {event.description}
            </div>
            <div className="event-details">
              <div className="event-detail">
                <span className="detail-icon">📅</span>
                <span>{event.date}</span>
              </div>
              <div className="event-detail">
                <span className="detail-icon">⏰</span>
                <span>{event.time}</span>
              </div>
              <div className="event-detail">
                <span className="detail-icon">📍</span>
                <span>{event.location}</span>
              </div>
            </div>
            <div className="event-actions">
              <button 
                className="edit-button"
                onClick={() => handleEditEvent(event)}
              >
                ✏️ Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteEvent(event.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsManagement;
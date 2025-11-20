import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from './UserManagement';
import CreateAccount from './CreateAccount';
import RoomAvailability from './RoomAvailability'; // ADD THIS IMPORT
import EventsManagement from './EventsManagement';
import AnnouncementsManagement from './AnnouncementsManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <AdminOverview />;
      case 'user-management':
        return <UserManagement />;
      case 'create-account':
        return <CreateAccount />;
      case 'room-availability': // ADD THIS CASE
        return <RoomAvailability />;
      case 'events':
        return <EventsManagement />;
      case 'announcements':
        return <AnnouncementsManagement />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar onMenuChange={setActiveComponent} />
      <div className="admin-main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

// Admin Overview Component - Enhanced with Room Availability stats
const AdminOverview = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: '👥', color: '#3498db' },
    { label: 'Active Students', value: '890', icon: '🎓', color: '#2ecc71' },
    { label: 'Faculty Members', value: '156', icon: '👨‍🏫', color: '#9b59b6' },
    { label: 'Staff Members', value: '188', icon: '👔', color: '#f39c12' },
    { label: 'Available Rooms', value: '42', icon: '🏢', color: '#27ae60' }, // ADDED ROOM STAT
    { label: 'Active Events', value: '15', icon: '📅', color: '#e74c3c' },
    { label: 'Announcements', value: '8', icon: '📢', color: '#1abc9c' },
    { label: 'System Status', value: 'Online', icon: '✅', color: '#16a085' }
  ];

  const quickActions = [
    {
      label: 'Create User Account',
      icon: '➕',
      component: 'create-account',
      description: 'Add new students, faculty, or staff'
    },
    {
      label: 'Manage Users',
      icon: '👥',
      component: 'user-management',
      description: 'Edit, update, or remove user accounts'
    },
    {
      label: 'Room Availability',
      icon: '🏢',
      component: 'room-availability',
      description: 'View and manage classroom bookings'
    },
    {
      label: 'Events Management',
      icon: '📅',
      component: 'events',
      description: 'Schedule and manage university events'
    }
  ];

  const [activeAction, setActiveAction] = useState(null);

  const handleActionClick = (component) => {
    setActiveAction(component);
    // You might want to navigate to the component here
    console.log('Quick action clicked:', component);
  };

  return (
    <div className="admin-overview">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to University Management System Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
            <h3>{stat.label}</h3>
            <div className="stat-number">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="quick-action-card"
              onClick={() => handleActionClick(action.component)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4>{action.label}</h4>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-details">
              <p><strong>New faculty member added</strong></p>
              <span className="activity-time">10 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🏢</div>
            <div className="activity-details">
              <p><strong>Room 201 booked for workshop</strong></p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📢</div>
            <div className="activity-details">
              <p><strong>New campus announcement published</strong></p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-details">
              <p><strong>System maintenance completed</strong></p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
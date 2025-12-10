import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from './UserManagement';
import CreateAccount from './CreateAccount';
import RoomCalendar from './RoomCalendar';
import EventsManagement from './EventsManagement';
import AnnouncementsManagement from './AnnouncementsManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <AdminOverview setActiveComponent={setActiveComponent} />;
      case 'user-management':
        return <UserManagement />;
      case 'create-account':
        return <CreateAccount />;
      case 'room-availability':
        return <RoomCalendar />;
      case 'events':
        return <EventsManagement />;
      case 'announcements':
        return <AnnouncementsManagement />;
      default:
        return <AdminOverview setActiveComponent={setActiveComponent} />;
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

// Admin Overview Component - Updated with proper CSS classes
const AdminOverview = ({ setActiveComponent }) => {
  const stats = [
    {
      label: 'Total Users',
      value: '1,234',
      icon: '👥',
      color: '#667eea',
      trend: '+5%',
      description: 'Active system users'
    },
    {
      label: 'Active Students',
      value: '890',
      icon: '🎓',
      color: '#2ecc71',
      trend: '+12%',
      description: 'Currently enrolled students'
    },
    {
      label: 'Faculty Members',
      value: '156',
      icon: '👨‍🏫',
      color: '#9b59b6',
      trend: '+3%',
      description: 'Teaching staff'
    },
    {
      label: 'Staff Members',
      value: '188',
      icon: '👔',
      color: '#f39c12',
      trend: '+2%',
      description: 'Administrative staff'
    },
    {
      label: 'Available Rooms',
      value: '42',
      icon: '🏢',
      color: '#27ae60',
      trend: '+8%',
      description: 'Classrooms available'
    },
    {
      label: 'Active Events',
      value: '15',
      icon: '📅',
      color: '#e74c3c',
      trend: '+25%',
      description: 'Scheduled events'
    },
    {
      label: 'Announcements',
      value: '8',
      icon: '📢',
      color: '#1abc9c',
      trend: '0%',
      description: 'Recent announcements'
    },
    {
      label: 'System Status',
      value: 'Online',
      icon: '✅',
      color: '#16a085',
      trend: '100%',
      description: 'System operational'
    }
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

  const handleActionClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="admin-overview">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>Welcome back, Admin 👋</h1>
          <p className="header-subtitle">Here's what's happening with your university today</p>
        </div>
        <div className="header-right">
          <div className="date-display">
            <span className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <span className="time">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="section-header">
          <h2>Overview Statistics</h2>
          <span className="section-subtitle">Real-time system metrics</span>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ borderLeftColor: stat.color }}
            >
              <div className="stat-icon-wrapper" style={{ background: `${stat.color}15` }}>
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <h3>{stat.label}</h3>
              <div className="stat-value">
                <div className="stat-number">{stat.value}</div>
                <span className="stat-trend" style={{
                  background: stat.trend.startsWith('+') ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                  color: stat.trend.startsWith('+') ? '#27ae60' : '#e74c3c'
                }}>
                  {stat.trend}
                </span>
              </div>
              <div className="stat-label">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <span className="section-subtitle">Frequently used admin tasks</span>
        </div>
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
        <div className="section-header">
          <h2>Recent Activity</h2>
          <span className="section-subtitle">Latest system updates</span>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-details">
              <p><strong>New faculty member added</strong></p>
              <p className="activity-description">Dr. Sarah Johnson joined Computer Science department</p>
              <span className="activity-time">10 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🏢</div>
            <div className="activity-details">
              <p><strong>Room 201 booked for workshop</strong></p>
              <p className="activity-description">Machine Learning workshop scheduled for tomorrow</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📢</div>
            <div className="activity-details">
              <p><strong>New campus announcement published</strong></p>
              <p className="activity-description">Holiday schedule for upcoming semester break</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-details">
              <p><strong>System maintenance completed</strong></p>
              <p className="activity-description">Database optimization and security updates applied</p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
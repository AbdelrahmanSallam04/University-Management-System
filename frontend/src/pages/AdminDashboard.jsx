import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from './UserManagement';
import CreateAccount from './CreateAccount';
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

// Admin Overview Component - Simplified without recent activity
const AdminOverview = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: '👥', color: '#3498db' },
    { label: 'Active Students', value: '890', icon: '🎓', color: '#2ecc71' },
    { label: 'Faculty Members', value: '156', icon: '👨‍🏫', color: '#9b59b6' },
    { label: 'Staff Members', value: '188', icon: '👔', color: '#f39c12' },
    { label: 'Active Events', value: '15', icon: '📅', color: '#e74c3c' },
    { label: 'Announcements', value: '8', icon: '📢', color: '#1abc9c' }
  ];

  return (
    <div className="admin-overview">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to University Management System Admin Panel</p>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
            <h3>{stat.label}</h3>
            <div className="stat-number">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
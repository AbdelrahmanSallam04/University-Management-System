import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
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

// Temporary components (we'll create proper files later)
const AdminOverview = () => {
  return (
    <div className="admin-overview">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to University Management System Admin Panel</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">1,234</div>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <div className="stat-number">15</div>
        </div>
        <div className="stat-card">
          <h3>Announcements</h3>
          <div className="stat-number">8</div>
        </div>
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <div className="stat-number">23</div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => <div>User Management Component - To be implemented</div>;
const CreateAccount = () => <div>Create Account Component - To be implemented</div>;
const EventsManagement = () => <div>Events Management Component - To be implemented</div>;
const AnnouncementsManagement = () => <div>Announcements Management Component - To be implemented</div>;

export default AdminDashboard;
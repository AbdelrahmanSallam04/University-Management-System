import React, { useState } from 'react';
import '../styles/AdminSidebar.css';

const AdminSidebar = ({ onMenuChange }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'user-management', label: 'User Management', icon: '👥' },
    { id: 'create-account', label: 'Create Account', icon: '➕' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'room-availability', label: 'Room Availability', icon: '🏢' },
    {id: 'resources-management', label: 'Resources Management', icon: '📦'}
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    onMenuChange(menuId);
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <span>🏛️</span>
          Admin Panel
        </div>
        <div className="admin-university-name">
          University Management System
        </div>
      </div>

      <div className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`admin-menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.id)}
          >
            <span className="admin-menu-icon">{item.icon}</span>
            <span className="admin-menu-label">{item.label}</span>
            <div className="admin-active-indicator"></div>
          </div>
        ))}
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-logout-button">
          <span className="admin-logout-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
import React, { useState } from 'react';
import '../styles/AdminSidebar.css';
// Remove useNavigate from here - we'll handle logout in AdminDashboard

const AdminSidebar = ({ onMenuChange, onLogout }) => { // Add onLogout as a prop
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'user-management', label: 'User Management', icon: '👥' },
    { id: 'create-account', label: 'Create Account', icon: '➕' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'room-availability', label: 'Room Availability', icon: '🏢' },
    { id: 'resources-management', label: 'Resources Management', icon: '📦' },
    { id: 'Maintenance-Report', label: 'Maintenance Report', icon: '⚙️' },
    { id: 'Maintenance-View', label: 'Maintenance View', icon: '🔧' }
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
        <button
          className="admin-logout-button"
          onClick={onLogout} // Use the onLogout prop passed from parent
        >
          <span className="admin-logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/StudentSidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/course-catalog", label: "Courses", icon: "📚" },
    { path: "/grades", label: "Results", icon: "📝" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/schedule", label: "Schedule", icon: "📅" },
    { path: "/notice", label: "Notice", icon: "📢" },
    { path: "/resources", label: "Resources", icon: "💼" },
    { path: "/messages", label: "Messages", icon: "💬" },
  ];

  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🎓 UniPortal</div>
        <div className="university-name">University Management System</div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${activeItem === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <div className="active-indicator"></div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div
          className="logout-button"
          onClick={() => navigate("/logout")}
        >
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
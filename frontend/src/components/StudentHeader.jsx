import React, { useState } from "react";
import "../styles/StudentHeader.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="header">
      <div className="search-container">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          placeholder="Search courses, assignments, announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
          <span className="bell-icon">🔔</span>
          <span className="notification-count">3</span>
        </div>

        <div className="user-info">
          <div className="user-details">
            <span className="user-name">Kanzoozz</span>
            <small className="user-year">3rd Year - Computer Science</small>
          </div>
          <div className="avatar">KS</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
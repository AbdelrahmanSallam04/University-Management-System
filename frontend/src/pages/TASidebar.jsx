import React from 'react';
import '../styles/TAsideBar.css';

const TASidebar = ({ currentView, setCurrentView, handleLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'courses', label: 'My Courses', icon: '📚' },
        { id: 'publish_content', label: 'Publish Assignment', icon: '📝' },
        { id: 'room_availability', label: 'Room Booking', icon: '🗓️' },
        { id: 'office_hours', label: 'Office Hours', icon: '⏰' },
    ];

    return (
        <aside className="ta-sidebar">
            <div className="sidebar-header">
                <h2>TA Portal</h2>
                <div className="user-badge">
                    <span className="badge-icon">👨‍🏫</span>
                    <span className="badge-text">Teaching Assistant</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <button
                                className={`nav-button ${currentView === item.id ? 'active' : ''}`}
                                onClick={() => setCurrentView(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-button" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    <span className="logout-text">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default TASidebar;
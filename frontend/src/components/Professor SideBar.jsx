import React from 'react';
import '../styles/ProfessorDashboard.css';

const Sidebar = ({ currentView, setCurrentView, handleLogout }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard Overview', icon: '🏠' },
        { id: 'courses', label: 'Courses Teaching', icon: '📚' },
        { id: 'room_availability', label: 'Room Availability', icon: '📅' },
        // New Menu Item
        { id: 'publish_content', label: 'Publish Content', icon: '📝' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="menu-icon">🎓</span>
                    Uni Portal
                </div>
                <div className="university-name">Professor Access</div>
            </div>

            <nav className="sidebar-menu">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`menu-item ${currentView === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentView(item.id)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-label">{item.label}</span>
                        <span className="active-indicator"></span>
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="logout-button" onClick={handleLogout}>
                    <span className="logout-icon">➡️</span>
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
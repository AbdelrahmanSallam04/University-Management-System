import React from 'react';
import '../styles/ParentDashboard.css';

const ParentSidebar = ({ currentView, setCurrentView, handleLogout }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'children', label: 'My Children', icon: '👨‍👩‍👧‍👦' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'grades', label: 'Grades', icon: '📚' },

    ];

    return (
        <aside className="parent-sidebar">
            {/* Simple Header */}
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">👨‍👩‍👧‍👦</span>
                    <div className="logo-text">
                        <h3>Parent Portal</h3>
                        <p>University System</p>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="profile-section">
                <div className="profile-avatar">
                    <span className="avatar-initial">P</span>
                </div>
                <div className="profile-info">
                    <h4>John Parent</h4>
                    <p>parent@university.edu</p>
                </div>
            </div>

            {/* Navigation Menu - Clean */}
            <nav className="sidebar-menu">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`menu-item ${currentView === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentView(item.id)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-label">{item.label}</span>
                    </div>
                ))}
            </nav>

            {/* Simple Logout */}
            <div className="sidebar-footer">
                <div className="logout-button" onClick={handleLogout}>
                    <span className="logout-icon">↪</span>
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default ParentSidebar;
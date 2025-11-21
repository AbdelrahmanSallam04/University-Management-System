import React from 'react';
// Make sure the path matches where your CSS is located
import '../styles/ProfessorDashboard.css';

const Sidebar = ({ currentView, setCurrentView, handleLogout }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard Overview', icon: '🏠' },
        { id: 'advisees', label: 'Advised Students', icon: '🧑‍🎓' },
        { id: 'courses', label: 'Courses Teaching', icon: '📚' },
        { id: 'room_availability', label: '  Room Availability', icon: '📅' },
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
                        // This updates the state in the parent component
                        onClick={() => setCurrentView(item.id)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-label">{item.label}</span>
                        <span className="active-indicator"></span>
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                {/* FIX: calls the handleLogout prop passed from Dashboard */}
                <div className="logout-button" onClick={handleLogout}>
                    <span className="logout-icon">➡️</span>
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
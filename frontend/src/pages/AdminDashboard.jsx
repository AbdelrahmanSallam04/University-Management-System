import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from './UserManagement';
import CreateAccount from './CreateAccount';
import RoomAvailabilityComponent from '../components/RoomAvailabilityComponent';
import EventsManagement from './EventsManagement';
import AnnouncementsManagement from './AnnouncementsManagement';
import ResourcesManagement from './ResourceManagement';
import '../styles/AdminDashboard.css';
import MaintenanceManagement from "../components/MaintenanceManagement";
import MaintenanceReportForm from "../components/MaintenanceReportForm";

const AdminDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const navigate = useNavigate(); // Initialize navigate

    // Define handleLogout function here
    const handleLogout = () => {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        sessionStorage.clear();

        // Navigate to login page
        navigate('/login');

        // Optional: Show logout message
        console.log('Logged out successfully');
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <AdminOverview setActiveComponent={setActiveComponent} />;
            case 'user-management':
                return <UserManagement />;
            case 'create-account':
                return <CreateAccount />;
            case 'room-availability':
                return <RoomAvailabilityComponent />;
            case 'announcements':
                return <AnnouncementsManagement />;
            case 'resources-management':
                return <ResourcesManagement />;
            case 'Maintenance-Report':
                return <MaintenanceReportForm />;
            case 'Maintenance-View':
                return <MaintenanceManagement />;
            case 'events': // Add this case
                return <EventsManagement />;
            default:
                return <AdminOverview setActiveComponent={setActiveComponent} />;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Pass handleLogout as a prop to AdminSidebar */}
            <AdminSidebar
                onMenuChange={setActiveComponent}
                onLogout={handleLogout} // Add this line
            />
            <div className="admin-main-content">
                {renderComponent()}
            </div>
        </div>
    );
};

// Enhanced Admin Overview Component
const AdminOverview = ({ setActiveComponent }) => {
    const stats = [
        { label: 'Total Users', icon: '👥', color: '#3498db', change: '+12% from last month' },
        { label: 'Active Students', icon: '🎓', color: '#2ecc71', change: '+8% today' },
        { label: 'Faculty Members', icon: '👨‍🏫', color: '#9b59b6', change: '+2 new' },
        { label: 'Staff Members',  icon: '👔', color: '#f39c12', change: 'No change' },
        { label: 'Available Rooms', icon: '🏢', color: '#27ae60', change: '65% availability' },
        { label: 'Announcements', icon: '📢', color: '#1abc9c', change: '2 new' }
    ];

    const quickActions = [
        {
            label: 'Create User Account',
            icon: '➕',
            component: 'create-account',
            description: 'Add new students, faculty, or staff'
        },
        {
            label: 'Manage Users',
            icon: '👥',
            component: 'user-management',
            description: 'Edit, update, or remove user accounts'
        },
        {
            label: 'Room Availability',
            icon: '🏢',
            component: 'room-availability',
            description: 'View and manage classroom bookings'
        },
        {
            label: 'Events Management',
            icon: '📅',
            component: 'events',
            description: 'Schedule and manage university events'
        },
        {
            label: 'Announcements',
            icon: '📢',
            component: 'announcements',
            description: 'Create campus announcements'
        }
    ];

    const handleActionClick = (component) => {
        setActiveComponent(component);
    };

    const getStatusColor = (change) => {
        if (change.includes('+')) return 'positive';
        if (change.includes('-')) return 'negative';
        return '';
    };

    return (
        <div className="admin-overview">
            {/* Header Section */}
            <div className="admin-header">
                <h1>University Management System Dashboard</h1>
                <p>Welcome back, Administrator. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        style={{ borderLeftColor: stat.color }}
                        onClick={() => {
                            if (stat.label.includes('Room')) setActiveComponent('room-availability');
                            if (stat.label.includes('Announcements')) setActiveComponent('announcements');
                            if (stat.label.includes('Events')) setActiveComponent('events');
                        }}
                    >
                        <div className="stat-icon" style={{ color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <h3>{stat.label}</h3>
                            <div className="stat-value">{stat.value}</div>
                            <div className={`stat-change ${getStatusColor(stat.change)}`}>
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Section */}
            <div className="quick-actions-section">
                <div className="section-header">
                    <h2>Quick Actions</h2>
                    <p>Frequently used admin tasks</p>
                </div>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <div
                            key={index}
                            className="quick-action-card"
                            onClick={() => handleActionClick(action.component)}
                        >
                            <div className="action-icon">{action.icon}</div>
                            <div className="action-content">
                                <h4>{action.label}</h4>
                                <p>{action.description}</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
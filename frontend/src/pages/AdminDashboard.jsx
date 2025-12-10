import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from './UserManagement';
import CreateAccount from './CreateAccount';
import RoomAvailabilityComponent from '../components/RoomAvailabilityComponent';
import EventsManagement from './EventsManagement';
import AnnouncementsManagement from './AnnouncementsManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('dashboard');

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
            case 'events':
                return <EventsManagement />;
            case 'announcements':
                return <AnnouncementsManagement />;
            default:
                return <AdminOverview setActiveComponent={setActiveComponent} />;
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

// Enhanced Admin Overview Component
const AdminOverview = ({ setActiveComponent }) => {
    const stats = [
        { label: 'Total Users', value: '1,234', icon: '👥', color: '#3498db', change: '+12% from last month' },
        { label: 'Active Students', value: '890', icon: '🎓', color: '#2ecc71', change: '+8% today' },
        { label: 'Faculty Members', value: '156', icon: '👨‍🏫', color: '#9b59b6', change: '+2 new' },
        { label: 'Staff Members', value: '188', icon: '👔', color: '#f39c12', change: 'No change' },
        { label: 'Available Rooms', value: '42', icon: '🏢', color: '#27ae60', change: '65% availability' },
        { label: 'Active Events', value: '15', icon: '📅', color: '#e74c3c', change: '+3 today' },
        { label: 'Announcements', value: '8', icon: '📢', color: '#1abc9c', change: '2 new' },
        { label: 'System Status', value: 'Online', icon: '✅', color: '#16a085', change: 'All systems operational' }
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
        },
        {
            label: 'Generate Reports',
            icon: '📊',
            component: 'reports',
            description: 'System usage and analytics'
        }
    ];

    const recentActivity = [
        {
            icon: '👤',
            title: 'New faculty member added',
            description: 'Dr. Sarah Johnson joined Computer Science Department',
            time: '10 minutes ago',
            type: 'user'
        },
        {
            icon: '🏢',
            title: 'Room 201 booked for workshop',
            description: 'Machine Learning Workshop scheduled for tomorrow',
            time: '1 hour ago',
            type: 'room'
        },
        {
            icon: '📢',
            title: 'New campus announcement published',
            description: 'Important update about final exams schedule',
            time: '2 hours ago',
            type: 'announcement'
        },
        {
            icon: '✅',
            title: 'System maintenance completed',
            description: 'All services are now running smoothly',
            time: '4 hours ago',
            type: 'system'
        },
        {
            icon: '🎓',
            title: 'Student registration peak',
            description: 'Over 200 new student registrations today',
            time: '6 hours ago',
            type: 'registration'
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
                <div className="header-actions">
                    <button
                        className="btn-primary"
                        onClick={() => setActiveComponent('create-account')}
                    >
                        + Create New Account
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => setActiveComponent('room-availability')}
                    >
                        📅 Book Room
                    </button>
                </div>
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

            {/* Recent Activity & Upcoming Events Side-by-side */}
            <div className="dashboard-bottom-section">
                {/* Recent Activity */}
                <div className="recent-activity">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                        <button
                            className="btn-text"
                            onClick={() => console.log('View all activity')}
                        >
                            View All →
                        </button>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">{activity.icon}</div>
                                <div className="activity-details">
                                    <p className="activity-title">{activity.title}</p>
                                    <p className="activity-description">{activity.description}</p>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                                {activity.type === 'room' && (
                                    <span className="activity-badge">Room Booking</span>
                                )}
                                {activity.type === 'announcement' && (
                                    <span className="activity-badge announcement">Announcement</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Bookings */}
                <div className="upcoming-bookings">
                    <div className="section-header">
                        <h2>Upcoming Room Bookings</h2>
                        <button
                            className="btn-text"
                            onClick={() => setActiveComponent('room-availability')}
                        >
                            Manage All →
                        </button>
                    </div>
                    <div className="booking-list">
                        <div className="booking-item">
                            <div className="booking-room">Room 201</div>
                            <div className="booking-details">
                                <h4>Machine Learning Workshop</h4>
                                <p>Computer Science Department</p>
                                <div className="booking-time">
                                    <span>📅 Tomorrow, 10:00 AM - 12:00 PM</span>
                                </div>
                            </div>
                            <div className="booking-status confirmed">Confirmed</div>
                        </div>
                        <div className="booking-item">
                            <div className="booking-room">Auditorium</div>
                            <div className="booking-details">
                                <h4>Annual Convocation</h4>
                                <p>University Administration</p>
                                <div className="booking-time">
                                    <span>📅 Dec 15, 9:00 AM - 5:00 PM</span>
                                </div>
                            </div>
                            <div className="booking-status confirmed">Confirmed</div>
                        </div>
                        <div className="booking-item">
                            <div className="booking-room">Room 105</div>
                            <div className="booking-details">
                                <h4>Faculty Meeting</h4>
                                <p>Mathematics Department</p>
                                <div className="booking-time">
                                    <span>📅 Today, 3:00 PM - 4:30 PM</span>
                                </div>
                            </div>
                            <div className="booking-status pending">Pending</div>
                        </div>
                    </div>
                    <div className="booking-stats">
                        <div className="stat">
                            <div className="stat-number">8</div>
                            <div className="stat-label">Bookings Today</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">42</div>
                            <div className="stat-label">Available Rooms</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">3</div>
                            <div className="stat-label">Pending Approvals</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
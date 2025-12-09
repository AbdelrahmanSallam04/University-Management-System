import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from '../pages/UserManagement';
import CreateAccount from '../components/CreateAccount';
import RoomAvailabilityComponent from '../components/RoomAvailabilityComponent'; // <--- NEW IMPORT
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('dashboard');

    // MOCK/Placeholder for Admin User ID (Needed for the booking FK in the service layer)
    const adminUserId = 1;
    const [myBookings, setMyBookings] = useState([]); // State for tracking bookings

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <AdminOverview setActiveComponent={setActiveComponent} />;
            case 'user-management':
                return <UserManagement />;
            case 'create-account':
                return <CreateAccount />;
            case 'room-availability':
                // CRITICAL: Render the reusable component and pass the Admin user ID
                return (
                    <RoomAvailabilityComponent/>
                );
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

// --- Updated AdminOverview to pass setActiveComponent ---
const AdminOverview = ({ setActiveComponent }) => {
    // ... (content remains the same) ...

    return (
        <div className="admin-overview">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome to University Management System Admin Panel</p>
            </div>

            <div className="stats-grid">
                {/* ... Stat Cards ... */}
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <h3>Total Users</h3>
                    <div className="stat-number">1,234</div>
                    <div className="stat-change positive">+12% from last month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <h3>Active Events</h3>
                    <div className="stat-number">15</div>
                    <div className="stat-change positive">+3 today</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📢</div>
                    <h3>Announcements</h3>
                    <div className="stat-number">8</div>
                    <div className="stat-change">2 new</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏢</div>
                    <h3>Available Rooms</h3>
                    <div className="stat-number">42</div>
                    <div className="stat-change positive">65% availability</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏰</div>
                    <h3>Pending Requests</h3>
                    <div className="stat-number">23</div>
                    <div className="stat-change negative">+5 urgent</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <h3>System Status</h3>
                    <div className="stat-number">Online</div>
                    <div className="stat-change positive">All systems operational</div>
                </div>
            </div>

            {/* Quick Actions (Updated onClick handlers) */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <div className="action-card" onClick={() => setActiveComponent('create-account')}>
                        <div className="action-icon">➕</div>
                        <h4>Create User Account</h4>
                        <p>Add new students, faculty, or staff</p>
                    </div>
                    <div className="action-card" onClick={() => setActiveComponent('room-availability')}>
                        {/* Direct action button to open the Room Availability view */}
                        <div className="action-icon">🏢</div>
                        <h4>Check Room Availability</h4>
                        <p>View and manage classroom bookings</p>
                    </div>
                    <div className="action-card" onClick={() => setActiveComponent('user-management')}>
                        <div className="action-icon">👥</div>
                        <h4>Manage Users</h4>
                        <p>Edit, update, or remove user accounts</p>
                    </div>
                    <div className="action-card">
                        <div className="action-icon">📊</div>
                        <h4>View Reports</h4>
                        <p>Generate system usage reports</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">👤</div>
                        <div className="activity-content">
                            <p><strong>New user registered</strong> - John Doe (Faculty)</p>
                            <span className="activity-time">2 minutes ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">🏢</div>
                        <div className="activity-content">
                            <p><strong>Room booked</strong> - Science Building 101</p>
                            <span className="activity-time">15 minutes ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">📢</div>
                        <div className="activity-content">
                            <p><strong>Announcement published</strong> - Campus Maintenance</p>
                            <span className="activity-time">1 hour ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">✅</div>
                        <div className="activity-content">
                            <p><strong>System backup completed</strong></p>
                            <span className="activity-time">2 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Placeholder components for other menu items
const EventsManagement = () => (
    <div className="component-placeholder">
        <div className="placeholder-icon">📅</div>
        <h2>Events Management</h2>
        <p>This feature is coming soon. You'll be able to manage university events and schedules here.</p>
    </div>
);

const AnnouncementsManagement = () => (
    <div className="component-placeholder">
        <div className="placeholder-icon">📢</div>
        <h2>Announcements Management</h2>
        <p>This feature is coming soon. You'll be able to create and manage campus announcements here.</p>
    </div>
);

export default AdminDashboard;
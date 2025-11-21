import React from 'react';
import { useNavigate } from 'react-router-dom'; // Used to change the URL globally
// import AdminSidebar from './AdminSidebar'; // Renders the Admin Sidebar

const DashboardWrapper = ({ children }) => {
    const navigate = useNavigate();

    // Map the menu ID requested by AdminSidebar to its actual URL path
    // This mapping ensures the application navigates correctly when AdminSidebar calls onMenuChange(menuId)
    const pathToIdMap = {
        'dashboard': '/',
        'user-management': '/admin/users',
        'create-account': '/admin/account/new',
        'events': '/admin/events',
        'announcements': '/admin/announcements',
        'room-availability': '/room-availability'
    };

    /**
     * Handles the navigation event triggered by the AdminSidebar component.
     * This method translates the sidebar's local menuId state change into a global route change.
     * @param {string} menuId - The ID of the menu item clicked (e.g., 'room-availability').
     */
    const handleSidebarNavigation = (menuId) => {
        const path = pathToIdMap[menuId];
        if (path) {
            navigate(path);
        } else {
            // Optional: If you click Logout, you'll need to handle the /logout route in AppRoutes
            console.warn(`Attempted navigation to unknown menuId: ${menuId}`);
        }
    };

    return (
        <div className="uniportal-layout">
            {/* 1. Renders the fixed sidebar and passes the navigation callback */}
            {/*<AdminSidebar onMenuChange={handleSidebarNavigation} />*/}

            <div className="main-content">
                {/* 2. Renders the fixed header */}


                {/* 3. Renders the content of the current page (e.g., RoomCalendar) */}
                <div className="page-content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardWrapper;
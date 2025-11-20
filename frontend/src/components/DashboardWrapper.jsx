// frontend/src/components/DashboardWrapper.jsx

import React from 'react';
import StudentHeader from './StudentHeader';
import StudentSidebar from './StudentSidebar';
// Note: We'll put the primary layout CSS in App.css

const DashboardWrapper = ({ children }) => {
    return (
        <div className="uniportal-layout">
            <StudentSidebar />
            <div className="main-content">
                <StudentHeader />
                {/* The content container ensures the page content is pushed down past the fixed StudentHeader */}
                <div className="page-content-wrapper">
                    {children} {/* This renders the content of RoomCalendar.jsx */}
                </div>
            </div>
        </div>
    );
};

export default DashboardWrapper;
import React from 'react';
import '../styles/ViewAnnouncementsBtn.css';

const ViewAnnouncementsBtn = () => {
    const handleOpenNews = () => {
        // Opens the public announcements route in a new browser tab
        window.open('/public-announcements', '_blank');
    };

    return (
        <button className="public-news-btn" onClick={handleOpenNews}>
            <span className="icon">📢</span> View Campus News
        </button>
    );
};

export default ViewAnnouncementsBtn;
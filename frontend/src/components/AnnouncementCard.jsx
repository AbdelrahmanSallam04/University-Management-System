import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AnnouncementCard.css';

const AnnouncementCard = ({ announcement, isAdminView = false }) => {
    const navigate = useNavigate();
    // Safe destructuring with defaults
    const { Title, Summary, Date, id } = announcement.attributes || {};

    const handleCardClick = () => {
        if (id) navigate(`/announcements/${id}`);
    };

    return (
        <div className="announcement-card" onClick={handleCardClick}>
            <div className="card-top">
                <span className="card-date-label">
                    <span className="calendar-icon">📅</span> {Date || 'Recent'}
                </span>
                <h3 className="card-title">{Title || announcement.name}</h3>
                <p className="card-summary">{Summary}</p>
            </div>

            <div className="card-footer">
                <span className="read-more-text">READ FULL POST</span>
                <div className="footer-right">
                    {isAdminView && <span className="admin-badge">Admin</span>}
                    <span className="action-arrow-small">→</span>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;
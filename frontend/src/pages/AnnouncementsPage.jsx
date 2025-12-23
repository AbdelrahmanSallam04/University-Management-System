import React, { useEffect, useState } from 'react';
import AnnouncementCard from '../components/AnnouncementCard';
import '../styles/PublicAnnouncement.css'; // Importing the new styles

const PublicAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/announcements/all')
            .then(res => res.json())
            .then(data => {
                setAnnouncements(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching:", err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="announcements-page">
            <header className="hero-section">
                <div className="hero-content">
                    <h1>University Announcements</h1>
                    <p>Stay informed about campus life, academic deadlines, and upcoming events.</p>
                </div>
            </header>

            <main className="announcements-container">
                {isLoading ? (
                    <div className="status-message">
                        <div className="spinner"></div>
                        <p>Loading latest updates...</p>
                    </div>
                ) : announcements.length > 0 ? (
                    <div className="announcements-grid">
                        {announcements.map((ann, index) => (
                            <AnnouncementCard key={ann.id || index} announcement={ann} />
                        ))}
                    </div>
                ) : (
                    <div className="status-message empty-state">
                        <p>No announcements available at the moment. Check back later!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PublicAnnouncements;
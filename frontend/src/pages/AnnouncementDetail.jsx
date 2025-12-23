import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AnnouncementDetail.css';

const AnnouncementDetail = () => {
    const { id } = useParams(); // Gets the ID from the URL (/announcements/5)
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/announcements/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncement(data);
                } else {
                    console.error("Failed to fetch announcement details");
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <div className="loading">Loading announcement...</div>;
    if (!announcement) return <div className="error">Announcement not found.</div>;

    const { attributes } = announcement;

    return (
        <div className="detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back to News
            </button>

            <article className="announcement-content">
                <header className="detail-header">
                    <h1>{attributes.Title}</h1>
                    <div className="meta-info">
                        <span className="date-tag">📅 {attributes.Date}</span>
                        {attributes.Category && <span className="category-tag">🏷️ {attributes.Category}</span>}
                    </div>
                </header>

                <section className="summary-section">
                    <h3>Summary</h3>
                    <p>{attributes.Summary}</p>
                </section>

                <hr />

                <section className="main-body">
                    <h3>Description</h3>
                    <p className="content-text">{attributes.Content}</p>
                </section>

                {/* Dynamic Attributes Section */}
                {Object.keys(attributes).some(key => !['Title', 'Date', 'Summary', 'Content', 'id'].includes(key)) && (
                    <section className="additional-info">
                        <h3>Additional Details</h3>
                        <ul>
                            {Object.entries(attributes).map(([key, value]) => {
                                // Skip the standard fields already displayed
                                if (['Title', 'Date', 'Summary', 'Content', 'id'].includes(key)) return null;
                                return (
                                    <li key={key}>
                                        <strong>{key}:</strong> {value}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}
            </article>
        </div>
    );
};

export default AnnouncementDetail;
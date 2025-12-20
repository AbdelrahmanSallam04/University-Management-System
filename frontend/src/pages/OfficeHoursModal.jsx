import React, { useState, useEffect } from 'react';
import '../styles/OfficeHoursModal.css';

const OfficeHoursModal = ({ staffMember, onClose }) => {
    const [officeHours, setOfficeHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOfficeHours();
    }, [staffMember.id]);

    const fetchOfficeHours = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(
                `http://localhost:8080/api/staff-directory/${staffMember.id}/office-hours`,
                {
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load office hours');
            }

            const data = await response.json();
            setOfficeHours(data);
        } catch (err) {
            console.error('Error fetching office hours:', err);
            setError('Failed to load office hours. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Group slots by date for better display
    const groupSlotsByDate = (slots) => {
        const groups = {};
        slots.forEach(slot => {
            const dateStr = new Date(slot.slotDateTime).toDateString();
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(slot);
        });

        // Sort dates
        return Object.keys(groups)
            .sort((a, b) => new Date(a) - new Date(b))
            .reduce((sorted, key) => {
                sorted[key] = groups[key].sort((a, b) =>
                    new Date(a.slotDateTime) - new Date(b.slotDateTime)
                );
                return sorted;
            }, {});
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <h2>
                            {staffMember.staffType === 'Professor' ? '👨‍🏫' : '👨‍🎓'}
                            {staffMember.firstName} {staffMember.lastName}'s Office Hours
                        </h2>
                        <p className="staff-role">{staffMember.staffType}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                            <p>Loading office hours...</p>
                        </div>
                    ) : officeHours.length === 0 ? (
                        <div className="no-office-hours">
                            <div className="no-hours-icon">📅</div>
                            <h3>No Office Hours Scheduled</h3>
                            <p>This {staffMember.staffType.toLowerCase()} hasn't set up office hours yet.</p>
                            <button className="retry-button" onClick={fetchOfficeHours}>
                                Refresh
                            </button>
                        </div>
                    ) : (
                        officeHours.map((oh) => {
                            // Group slots by date
                            const allSlots = oh.slots || [];
                            const slotsByDate = groupSlotsByDate(allSlots);

                            return (
                                <div key={oh.id} className="office-hours-group">
                                    <div className="schedule-header">
                                        <h3>
                                            <span className="day">{oh.dayOfWeek}</span>
                                            <span className="time-range">
                                                {oh.startTime} - {oh.endTime}
                                            </span>
                                            <span className="slot-info">
                                                ({oh.slotDuration} minute slots)
                                            </span>
                                        </h3>
                                    </div>

                                    {Object.keys(slotsByDate).length > 0 ? (
                                        <div className="slots-section">
                                            <h4>📅 Scheduled Time Slots:</h4>
                                            {Object.entries(slotsByDate).map(([date, slots]) => (
                                                <div key={date} className="date-group">
                                                    <h5 className="date-header">{formatDate(date)}</h5>
                                                    <div className="time-slots">
                                                        {slots.map((slot) => (
                                                            <div
                                                                key={slot.id}
                                                                className={`time-slot ${slot.status === 'BOOKED' ? 'booked' : 'available'}`}
                                                            >
                                                                <div className="slot-info-container">
                                                                    <span className="slot-time">
                                                                        {formatTime(slot.slotDateTime)} - {formatTime(slot.endDateTime)}
                                                                    </span>
                                                                    <span className={`slot-status ${slot.status === 'BOOKED' ? 'booked' : 'available'}`}>
                                                                        {slot.status === 'BOOKED' ?
                                                                            `Booked by ${slot.studentName || 'student'}` :
                                                                            'Available'}
                                                                    </span>
                                                                    {slot.status === 'BOOKED' && slot.purpose && (
                                                                        <div className="slot-purpose">
                                                                            Purpose: {slot.purpose}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-available-slots">
                                            <p>No upcoming slots scheduled for this office hours schedule.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="modal-footer">
                    <div className="info-note">
                        <p>ℹ️ Office hours display only. Booking functionality coming soon.</p>
                    </div>
                    <button className="btn-close-modal" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficeHoursModal;
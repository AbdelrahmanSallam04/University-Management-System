import React, { useState, useEffect } from 'react';
import '../styles/OfficeHoursModal.css';

const OfficeHoursModal = ({ staffMember, onClose }) => {
    const [officeHours, setOfficeHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingSlot, setBookingSlot] = useState(null);
    const [purpose, setPurpose] = useState('');
    const [error, setError] = useState('');
    const [bookingInProgress, setBookingInProgress] = useState(false);

    useEffect(() => {
        fetchOfficeHours();
        // Prevent body scroll
        document.body.classList.add('modal-open');

        return () => {
            // Cleanup
            document.body.classList.remove('modal-open');
        };
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

    const handleBookSlot = async (slotId) => {
        if (!purpose.trim()) {
            alert('Please enter a purpose for the meeting');
            return;
        }

        try {
            setBookingInProgress(true);
            setError('');

            const response = await fetch(
                `http://localhost:8080/api/staff-directory/slots/${slotId}/book`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ purpose: purpose.trim() })
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to book slot');
            }

            const result = await response.json();

            alert('✅ Office hour slot booked successfully!');
            setBookingSlot(null);
            setPurpose('');
            fetchOfficeHours(); // Refresh the list
        } catch (err) {
            console.error('Error booking slot:', err);
            setError(err.message);
            alert(`❌ ${err.message}`);
        } finally {
            setBookingInProgress(false);
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

    // Get grouped slots
    const groupedSlots = groupSlotsByDate(officeHours);

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
                        <div className="slots-section">
                            <h4>📅 Available Time Slots:</h4>
                            {Object.keys(groupedSlots).length > 0 ? (
                                Object.entries(groupedSlots).map(([date, slots]) => (
                                    <div key={date} className="date-group">
                                        <h5 className="date-header">{formatDate(date)}</h5>
                                        <div className="time-slots">
                                            {slots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className={`time-slot ${slot.status === 'BOOKED' ? 'booked' : 'available'}`}
                                                >
                                                    <div className="slot-info-container">
                                                        <div className="slot-time-container">
                                                            <span className="slot-time">
                                                                {formatTime(slot.slotDateTime)} - {formatTime(slot.endDateTime)}
                                                            </span>
                                                        </div>
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
                                                    {/* Check if slot is available and bookable */}
                                                    {slot.status === 'AVAILABLE' && slot.bookable && (
                                                        <button
                                                            className="book-btn"
                                                            onClick={() => setBookingSlot(slot)}
                                                        >
                                                            Book Slot
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-available-slots">
                                    <p>No upcoming office hour slots available.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Booking Modal */}
                {bookingSlot && (
                    <div className="booking-modal-overlay">
                        <div className="booking-modal">
                            <div className="booking-header">
                                <h3>📅 Confirm Booking</h3>
                                <button
                                    className="modal-close"
                                    onClick={() => setBookingSlot(null)}
                                    disabled={bookingInProgress}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="booking-details">
                                <p><strong>Staff Member:</strong> {staffMember.firstName} {staffMember.lastName}</p>
                                <p><strong>Date:</strong> {formatDate(bookingSlot.slotDateTime)}</p>
                                <p><strong>Time:</strong> {formatTime(bookingSlot.slotDateTime)} - {formatTime(bookingSlot.endDateTime)}</p>
                            </div>
                            <div className="booking-form">
                                <label htmlFor="purpose">Meeting Purpose:</label>
                                <textarea
                                    id="purpose"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="Please describe what you'd like to discuss..."
                                    rows={4}
                                    maxLength={500}
                                    disabled={bookingInProgress}
                                />
                                <div className="char-count">{purpose.length}/500 characters</div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn-cancel"
                                    onClick={() => {
                                        setBookingSlot(null);
                                        setPurpose('');
                                    }}
                                    disabled={bookingInProgress}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-register"
                                    onClick={() => handleBookSlot(bookingSlot.id)}
                                    disabled={!purpose.trim() || bookingInProgress}
                                >
                                    {bookingInProgress ? (
                                        <>
                                            <span className="spinner"></span>
                                            Booking...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="modal-footer">
                    <button className="btn-close-modal" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficeHoursModal;
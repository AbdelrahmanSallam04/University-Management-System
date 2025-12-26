import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const OfficeHoursManager = ({ staffMemberId }) => {  // Changed from professorId to staffMemberId
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setupData, setSetupData] = useState({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '11:00',
        numberOfWeeks: 4,
        slotDurationMinutes: 30
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [userType, setUserType] = useState(''); // To show if it's Professor or TA

    // 1. Data Fetching & Sorting
    const fetchSlots = useCallback(async () => {
        if (!staffMemberId) {
            console.error("staffMemberId is null or undefined");
            setStatus({ type: 'error', message: 'Staff member ID is required' });
            return;
        }

        try {
            console.log(`Fetching office hours for staff member ID: ${staffMemberId}`);

            const response = await axios.get(`/api/v1/office-hours/staff/${staffMemberId}`);

            // Sort slots by startTime chronologically
            const sortedSlots = response.data.sort((a, b) =>
                new Date(a.startTime) - new Date(b.startTime)
            );

            setSlots(sortedSlots);

            // Check if we're dealing with a professor or TA (optional)
            if (response.data.length > 0 && response.data[0].staffMember) {
                // You might have user type info in the response
                console.log('Staff member data:', response.data[0].staffMember);
            }

        } catch (err) {
            console.error("Failed to fetch slots", err);
            setStatus({
                type: 'error',
                message: err.response?.data?.message || "Failed to load office hours"
            });
        }
    }, [staffMemberId]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    // 2. Form Validation
    const validateTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const mins = parseInt(minutes);
        if (mins !== 0 && mins !== 30) {
            setStatus({ type: 'error', message: 'Please select a time ending in :00 or :30' });
            return false;
        }
        return true;
    };

    // 3. Form Submission
    const handleSetupSubmit = async (e) => {
        e.preventDefault();
        if (!staffMemberId) {
            setStatus({ type: 'error', message: 'Staff member ID is required' });
            return;
        }

        if (!validateTime(setupData.startTime) || !validateTime(setupData.endTime)) return;

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            console.log('Setting up office hours for staff member ID:', staffMemberId);

            await axios.post('/api/v1/office-hours/setup-recurring', {
                staffMemberId: staffMemberId,  // Use the passed staffMemberId
                ...setupData
            });

            setStatus({ type: 'success', message: 'Office hours generated successfully!' });
            fetchSlots(); // Refresh the list
        } catch (err) {
            console.error('Error setting up office hours:', err);
            setStatus({
                type: 'error',
                message: err.response?.data?.message || "Error generating slots. Check for overlaps."
            });
        } finally {
            setLoading(false);
        }
    };

    // Debug panel for development


    return (
        <div className="events-section">
            <div className="page-header">
                <h2>⏰ Manage Office Hours</h2>
                {!staffMemberId && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '10px',
                        borderRadius: '6px',
                        marginTop: '10px'
                    }}>
                        ⚠️ <strong>Error:</strong> No staff member ID provided. Cannot manage office hours.
                    </div>
                )}
            </div>

            {/* SETUP FORM */}
            <div className="publish-form-wrapper" style={{ marginBottom: '40px' }}>
                <h3>📅 Set Recurring Weekly Slots</h3>
                <form onSubmit={handleSetupSubmit}>
                    <div className="form-group">
                        <label className="form-label">Day of the Week</label>
                        <select
                            className="form-control"
                            value={setupData.dayOfWeek}
                            onChange={(e) => setSetupData({...setupData, dayOfWeek: e.target.value})}
                            disabled={!staffMemberId}
                        >
                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Time (:00 or :30)</label>
                            <input
                                type="time"
                                step="1800"
                                className="form-control"
                                value={setupData.startTime}
                                onChange={(e) => setSetupData({...setupData, startTime: e.target.value})}
                                required
                                disabled={!staffMemberId}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Time (:00 or :30)</label>
                            <input
                                type="time"
                                step="1800"
                                className="form-control"
                                value={setupData.endTime}
                                onChange={(e) => setSetupData({...setupData, endTime: e.target.value})}
                                required
                                disabled={!staffMemberId}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Repeat for how many weeks?</label>
                        <input
                            type="number"
                            min="1" max="16"
                            className="form-control"
                            value={setupData.numberOfWeeks}
                            onChange={(e) => setSetupData({...setupData, numberOfWeeks: parseInt(e.target.value)})}
                            disabled={!staffMemberId}
                        />
                    </div>

                    {status.message && (
                        <div className={`status-message status-${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading || !staffMemberId}
                    >
                        {loading ? 'Processing...' : 'Generate Weekly Slots'}
                    </button>

                    {!staffMemberId && (
                        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px' }}>
                            Please wait for staff member ID to load...
                        </p>
                    )}
                </form>
            </div>

            {/* SLOTS TABLE */}
            <h3>Existing Office Hours</h3>
            <div className="list-container">
                {!staffMemberId ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <p>Loading staff member information...</p>
                    </div>
                ) : slots.length > 0 ? (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Date & Day</th>
                            <th>Time Range</th>
                            <th>Status</th>
                            <th>Booked By</th>
                        </tr>
                        </thead>
                        <tbody>
                        {slots.map(slot => (
                            <tr key={slot.id}>
                                <td>
                                    <strong>{new Date(slot.startTime).toLocaleDateString()}</strong>
                                    <br />
                                    <small>{slot.dayOfWeek}</small>
                                </td>
                                <td>
                                    {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -
                                    {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td>
                                    <span className={`status-badge ${slot.status.toLowerCase()}`}>
                                        {slot.status}
                                    </span>
                                </td>
                                <td>{slot.bookedBy ? `${slot.bookedBy.firstName} ${slot.bookedBy.lastName}` : '—'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <p>No office hours scheduled yet. Use the form above to create some.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficeHoursManager;
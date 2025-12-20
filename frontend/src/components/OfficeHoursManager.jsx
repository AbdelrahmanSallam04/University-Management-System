import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const OfficeHoursManager = ({ professorId }) => {
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

    // 1. Data Fetching & Sorting
    const fetchSlots = useCallback(async () => {
        if (!professorId) return;
        try {
            const response = await axios.get(`/api/v1/office-hours/staff/${professorId}`);

            // Sort slots by startTime chronologically
            const sortedSlots = response.data.sort((a, b) =>
                new Date(a.startTime) - new Date(b.startTime)
            );

            setSlots(sortedSlots);
        } catch (err) {
            console.error("Failed to fetch slots", err);
        }
    }, [professorId]);

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
        if (!validateTime(setupData.startTime) || !validateTime(setupData.endTime)) return;

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post('/api/v1/office-hours/setup-recurring', {
                staffMemberId: professorId,
                ...setupData
            });
            setStatus({ type: 'success', message: 'Recurring office hours generated successfully!' });
            fetchSlots();
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || "Error generating slots. Check for overlaps."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="events-section">
            <div className="page-header">
                <h2>⏰ Manage Office Hours</h2>
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
                        />
                    </div>

                    {status.message && (
                        <div className={`status-message status-${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Generate Weekly Slots'}
                    </button>
                </form>
            </div>

            {/* SLOTS TABLE */}
            <h3>Existing Availability</h3>
            <div className="list-container">
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
                    {slots.length > 0 ? slots.map(slot => (
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
                    )) : (
                        <tr><td colSpan="4" style={{textAlign:'center', padding: '20px'}}>No slots found.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OfficeHoursManager;
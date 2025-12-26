import React, { useState, useEffect } from 'react';
import { fetchAvailableRooms, fetchAllRooms } from '../services/roomService';
import {submitReport} from '../services/maintenanceService';
import '../styles/MaintenanceReportForm.css';

const MaintenanceReportForm = () => {
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        roomId: '',
        priorityId: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const loadRooms = async () => {
            try {
                // FIX 3: Call fetchAllRooms without arguments (it doesn't need date/type)
                const data = await fetchAllRooms();
                setRooms(data);
            } catch (err) {
                console.error("Failed to load rooms", err);
            }
        };
        loadRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitReport({
                roomId: parseInt(formData.roomId),
                priorityId: parseInt(formData.priorityId),
                description: formData.description
            });
            setMessage({ type: 'success', text: 'Maintenance report submitted successfully!' });
            setFormData({ roomId: '', priorityId: '', description: '' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to submit report. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="maintenance-form-container">
            <h2>Report Maintenance Issue</h2>
            {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Room</label>
                    <select
                        value={formData.roomId}
                        onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                        required
                    >
                        <option value="">-- Select Room --</option>
                        {rooms && rooms.length > 0 ? (
                            rooms.map(room => (
                                // FIX: Use room.id (matches RoomDTO)
                                // FIX: Use room.roomCode (matches RoomDTO)
                                <option key={room.id} value={room.id}>
                                    {room.roomCode}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading rooms...</option>
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label>Priority Level</label>
                    <select
                        value={formData.priorityId}
                        onChange={(e) => setFormData({...formData, priorityId: e.target.value})}
                        required
                    >
                        <option value="">-- Select Priority --</option>
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Description of Issue</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe the problem (e.g., Broken AC, Projector not working)"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default MaintenanceReportForm;
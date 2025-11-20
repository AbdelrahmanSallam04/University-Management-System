// frontend/src/pages/RoomCalendar.jsx

import React, {useState, useEffect, useCallback} from 'react';
import DashboardWrapper from '../components/DashboardWrapper';
import { fetchAvailableRooms } from '../services/roomService'; // <--- IMPORT THE SERVICE

const RoomCalendar = () => {
    // 1. State for filter inputs
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [selectedRoomType, setSelectedRoomType] = useState('All Rooms');

    // 2. State for API data and loading/error status
    const [availableRooms, setAvailableRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    // 3. Function to trigger the API request
    const loadRooms = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchAvailableRooms(selectedDate, selectedRoomType);
            setAvailableRooms(data);
        } catch (err) {
            setError('Failed to load room data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, selectedRoomType]); // Dependencies for loadRooms

    // Now include loadRooms in the useEffect dependency array
    useEffect(() => {
        loadRooms();
    }, [loadRooms]);

    // 5. Handlers for input changes
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleRoomTypeChange = (e) => {
        setSelectedRoomType(e.target.value);
    };

    // ... (Your table styles remain here)
    const tableHeaderStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
    const tableCellStyle = { padding: '10px', textAlign: 'left' };

    return (
        <DashboardWrapper>
            <div className="calendar-page-container">
                <h2>🗓️ Classroom & Lab Availability</h2>

                {/* --- Search and Filter Area (UPDATED) --- */}
                <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>

                    <label style={{ marginRight: '15px' }}>Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange} // <--- CONNECTED
                        style={{ padding: '8px', marginRight: '10px' }}
                    />

                    <label style={{ marginRight: '15px' }}>Room Type:</label>
                    <select
                        value={selectedRoomType}
                        onChange={handleRoomTypeChange} // <--- CONNECTED
                        style={{ padding: '8px' }}
                    >
                        <option value="All Rooms">All Rooms</option>
                        <option value="Classroom">Classroom</option>
                        <option value="Computer Lab">Computer Lab</option>
                        {/* Add other room types here */}
                    </select>

                </div>

                {/* --- Availability List View (UPDATED) --- */}
                <div className="availability-list-section">

                    {error && <div style={{ padding: '15px', backgroundColor: '#fdd', color: 'darkred', borderRadius: '8px' }}>{error}</div>}
                    {isLoading && <div style={{ padding: '15px', textAlign: 'center' }}>Loading room availability...</div>}

                    {/* *** CRITICAL RENDERING BLOCK START *** */}
                    {!isLoading && !error && (
                        // This fragment ensures the whole table structure is rendered together
                        <>
                            <h3 className="section-title">Availability Status (Showing {availableRooms.length} slots for {new Date(selectedDate).toDateString()})</h3>

                            <div className="table-wrapper">
                                <table className="availability-table">
                                    <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Room Code</th>
                                        <th style={tableHeaderStyle}>Type</th>
                                        <th style={tableHeaderStyle}>Capacity</th>
                                        <th style={tableHeaderStyle}>Time Slot / Status</th>
                                        <th style={tableHeaderStyle}>Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {availableRooms.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                No room slots found for the selected criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        availableRooms.map((item, index) => (
                                            // Key must be applied to the row
                                            <tr key={item.id + "-" + index} className="table-row">
                                                <td style={tableCellStyle}>{item.roomCode}</td>
                                                <td style={tableCellStyle}>{item.roomType}</td>
                                                <td style={tableCellStyle}>{item.capacity}</td>
                                                <td style={{ ...tableCellStyle, color: item.status === 'Free' ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                                    {/* This TD was the only thing rendering previously */}
                                                    {item.status} - {item.timeSlot}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    {item.status === 'Free' ? (
                                                        <button className="book-button">Book Slot</button>
                                                    ) : (
                                                        <span style={{ fontSize: '14px', color: '#666' }}>{item.timeSlot}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {/* *** CRITICAL RENDERING BLOCK END *** */}
                </div>
            </div>
        </DashboardWrapper>
    );
};

export default RoomCalendar;
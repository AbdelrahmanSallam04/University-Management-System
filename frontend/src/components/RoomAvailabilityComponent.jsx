import React, { useState, useEffect, useCallback } from 'react';
import { fetchAvailableRooms, bookRoom, fetchUserBookings  } from '../services/roomService';
import BookingFormModal from '../pages/BookingFormModal'; // Assuming modal is in the same folder
import axios from 'axios';

// NOTE: This component is fully self-contained and reusable by both Admin and Professor.
const RoomAvailabilityComponent = () => {
    // State management for Filters and Data
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedRoomType, setSelectedRoomType] = useState('All Rooms');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Booking State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [myBookings, setMyBookings] = useState([]); // List to track session bookings


    // Add these with other state declarations
    const [userBookings, setUserBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // --- API CALL HANDLER ---
    const loadRooms = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchAvailableRooms(selectedDate, selectedRoomType);
            setAvailableRooms(data);
        } catch (err) {
            let errorMessage = 'Failed to load room data. Check backend logs.';
            if (axios.isAxiosError(err) && !err.response) {
                errorMessage = 'Connection Error: Cannot reach backend server on 8080.';
            } else if (err.response && err.response.data) {
                errorMessage = `API Error: ${err.response.data.message || err.response.data}`;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, selectedRoomType]);

    // Effect to trigger loading on component mount or filter change
    useEffect(() => {
        loadRooms();
    }, [loadRooms]);

    // --- BOOKING HANDLERS ---

    // Add this effect to load user bookings
    useEffect(() => {
        const loadBookings = async () => {
            setLoadingBookings(true);
            try {
                const bookings = await fetchUserBookings();
                setUserBookings(bookings);
            } catch (err) {
                console.error("Failed to load user bookings:", err);
            } finally {
                setLoadingBookings(false);
            }
        };
        loadBookings();
    }, []);

    const handleBookClick = (item) => {

        const [startTimeStr, endTimeStr] = item.timeSlot.split('-');
        setSelectedSlot({
            id: item.id,
            roomCode: item.roomCode,
            roomType: item.roomType,
            capacity: item.capacity,
            date: selectedDate,
            timeSlot: item.timeSlot,
            startTime: startTimeStr,
            endTime: endTimeStr
        });
        setIsModalOpen(true);
    };

    const handleBookingConfirm = async (purpose) => {
        const slot = selectedSlot;

        const bookingPayload = {
            roomId: slot.id,
            purpose: purpose,
            startTime: `${slot.date}T${slot.startTime}:00`,
            endTime: `${slot.date}T${slot.endTime}:00`
        };

        try {
            await bookRoom(bookingPayload);

            setIsModalOpen(false);

            // Refresh the user bookings list
            const updatedBookings = await fetchUserBookings();
            setUserBookings(updatedBookings);

            // Refresh table to show "Booked" status
            await loadRooms();

        } catch (err) {
            throw err;
        }
    };

    // --- RENDER HELPERS ---
    const tableHeaderStyle = { padding: '15px 20px', textAlign: 'left', borderBottom: '2px solid #ddd', backgroundColor: '#e0e7ff' };
    const tableCellStyle = { padding: '15px 20px', textAlign: 'left' };

    return (
        <div className="calendar-content-wrapper">
            <h2 style={{ marginBottom: '20px' }}>🗓️ Classroom & Lab Availability</h2>

            {/* Filter Area */}
            <div className="filter-card" style={{ margin: '20px 0', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
                <label style={{ marginRight: '15px', fontWeight: 'bold' }}>Date:</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ padding: '8px', marginRight: '10px' }} />

                <label style={{ marginLeft: '30px', marginRight: '15px', fontWeight: 'bold' }}>Room Type:</label>
                <select value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)} style={{ padding: '8px' }}>
                    <option value="All Rooms">All Rooms</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Computer Lab">Computer Lab</option>
                </select>
                <button onClick={loadRooms} className="refresh-button" disabled={isLoading} style={{ marginLeft: '20px', padding: '8px 15px', backgroundColor: '#3f51b5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    {isLoading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {/* --- My Bookings Section --- */}
            <div style={{
                marginTop: '40px',
                padding: '25px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        color: '#1e40af',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '24px' }}>📋</span>
                        My Bookings
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
            }}>
                {userBookings.length} booking{userBookings.length !== 1 ? 's' : ''}
            </span>
                        <button
                            onClick={async () => {
                                setLoadingBookings(true);
                                try {
                                    const bookings = await fetchUserBookings();
                                    setUserBookings(bookings);
                                } catch (err) {
                                    console.error(err);
                                } finally {
                                    setLoadingBookings(false);
                                }
                            }}
                            disabled={loadingBookings}
                            style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            {loadingBookings ? '↻' : '↻ Refresh'}
                        </button>
                    </div>
                </div>

                {loadingBookings ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '30px',
                        color: '#64748b'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                        <p style={{ margin: 0, fontSize: '14px' }}>Loading bookings...</p>
                    </div>
                ) : userBookings.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '30px',
                        color: '#64748b'
                    }}>
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>📭</div>
                        <p style={{ margin: 0, fontSize: '14px' }}>No bookings found.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '15px'
                    }}>
                        {userBookings.slice(0, 6).map((booking, index) => (
                            <div key={booking.bookingId || index} style={{
                                backgroundColor: 'white',
                                padding: '18px',
                                borderRadius: '8px',
                                border: '1px solid #e0e7ff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                position: 'relative'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px',
                                    alignItems: 'flex-start'
                                }}>
                                    <div>
                                        <strong style={{
                                            color: '#1e40af',
                                            fontSize: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                <span style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px'
                                }}>
                                    {booking.roomCode?.charAt(0) || 'R'}
                                </span>
                                            {booking.roomCode}
                                        </strong>
                                        <p style={{
                                            margin: '5px 0 0 0',
                                            fontSize: '13px',
                                            color: '#64748b'
                                        }}>
                                            {booking.roomType || 'Classroom'}
                                        </p>
                                    </div>
                                    <span style={{
                                        backgroundColor: booking.status === 'CONFIRMED' ? '#dcfce7' : '#fef3c7',
                                        color: booking.status === 'CONFIRMED' ? '#166534' : '#92400e',
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                    }}>
                            {booking.status || 'CONFIRMED'}
                        </span>
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                    <p style={{
                                        margin: '0 0 6px 0',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span>📅</span>
                                        {new Date(booking.startTime || booking.date).toLocaleDateString()}
                                    </p>
                                    <p style={{
                                        margin: '0 0 6px 0',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span>⏰</span>
                                        {booking.timeSlot || `${new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                                    </p>
                                </div>

                                <p style={{
                                    margin: '0',
                                    fontSize: '13px',
                                    color: '#475569',
                                    fontStyle: 'italic',
                                    backgroundColor: '#f1f5f9',
                                    padding: '8px',
                                    borderRadius: '4px'
                                }}>
                                    {booking.purpose?.substring(0, 60) || 'No purpose provided'}
                                    {booking.purpose?.length > 60 ? '...' : ''}
                                </p>
                            </div>
                        ))}

                        {userBookings.length > 6 && (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '15px',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '8px',
                                marginTop: '10px'
                            }}>
                                <p style={{ margin: 0, color: '#64748b' }}>
                                    Showing 6 of {userBookings.length} bookings.
                                    <button
                                        onClick={() => {
                                            // Implement view all functionality
                                            console.log('View all bookings');
                                        }}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: '#3b82f6',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            marginLeft: '5px'
                                        }}
                                    >
                                        View All
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Data Display */}
            <div className="availability-list-section">
                {error && <div className="error-message" style={{ padding: '15px', backgroundColor: '#fdd', color: 'darkred', borderRadius: '8px' }}>{error}</div>}
                {isLoading && <div className="loading-message" style={{ padding: '15px', textAlign: 'center' }}>Loading...</div>}

                {/* Table Rendering Block */}
                {!isLoading && !error && (
                    <div className="table-wrapper">
                        <table className="availability-table">
                            <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Room Code</th>
                                <th style={tableHeaderStyle}>Type</th>
                                <th style={tableHeaderStyle}>Capacity</th>
                                <th style={tableHeaderStyle}>Time Slot / Status</th>
                                <th style={tableHeaderStyle}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {availableRooms.map((item, index) => (
                                <tr key={`${item.id}-${index}`}
                                    className="table-row">
                                    <td style={tableCellStyle}>{item.roomCode}</td>
                                    <td style={tableCellStyle}>{item.roomType}</td>
                                    <td style={tableCellStyle}>{item.capacity}</td>
                                    <td style={{ ...tableCellStyle, color: item.status === 'Free' ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                        {item.status} - {item.timeSlot}
                                    </td>
                                    <td style={tableCellStyle}>
                                        {item.status === 'Free' ? (
                                            <button
                                                className="book-button"
                                                onClick={() => handleBookClick(item)}
                                            >
                                                Book Slot
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '14px', color: '#666' }}>Booked</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recently Booked Section */}
            {myBookings.length > 0 && (
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                    <h3 style={{ color: '#0284c7' }}>✅ Your Recent Bookings</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {myBookings.map((b, i) => (
                            <li key={i} style={{ marginBottom: '5px', color: '#334155' }}>
                                <strong>{b.roomCode}</strong> on {b.date} ({b.timeSlot}) - <em>{b.purpose}</em>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <BookingFormModal
                    slotDetails={selectedSlot}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleBookingConfirm}
                />
            )}
        </div>
    );
};

export default RoomAvailabilityComponent;
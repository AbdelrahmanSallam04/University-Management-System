import React, { useState } from 'react';
// Changed import to a dedicated CSS file for reusability in Admin and Professor dashboards
import '../styles/BookingFormModal.css';

const BookingFormModal = ({ slotDetails, onClose, onConfirm }) => {
    const [purpose, setPurpose] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!purpose.trim()) {
            setError('Please provide a purpose for the booking.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Pass the purpose up to the parent handler (which manages the API call)
            await onConfirm(purpose);
            // If successful, the parent will close the modal
        } catch (err) {
            // --- CRITICAL FIX: Extract the message string from the complex error object ---
            let errorMessage = 'Failed to create booking.';
            if (err.response && err.response.data) {
                // If it's a Spring Boot error object, get the .message property
                if (typeof err.response.data === 'object' && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
                // Fallback for plain error strings
                else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setIsSubmitting(false);
            // --- END CRITICAL FIX ---
        }
    };

    // Don't render if no slot is selected
    if (!slotDetails) return null;

    // --- Inline Styles Definition (for portability) ---
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: 'white', padding: '25px', borderRadius: '12px',
        width: '90%', maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out'
    };


    return (
        <div className="modal-overlay" style={overlayStyle}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={modalStyle}>

                {/* Modal Header */}
                <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#3f51b5' }}>Confirm Booking</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>&times;</button>
                </div>

                {/* Room Details Summary */}
                <div className="booking-summary" style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '5px 0' }}><strong>Room:</strong> {slotDetails.roomCode} <span style={{ color: '#64748b', fontSize: '0.9em' }}>({slotDetails.roomType})</span></p>
                    <p style={{ margin: '5px 0' }}><strong>Date:</strong> {slotDetails.date}</p>
                    <p style={{ margin: '5px 0' }}><strong>Time:</strong> {slotDetails.timeSlot}</p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                        Purpose of Booking <span style={{ color: 'red' }}>*</span>
                    </label>

                    <textarea
                        value={purpose}
                        onChange={(e) => {
                            setPurpose(e.target.value);
                            if(error) setError(null);
                        }}
                        placeholder="e.g., Make-up Lecture for CS101, Student Project Review..."
                        required
                        rows="3"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        disabled={isSubmitting}
                    />

                    {/* Error Message Display */}
                    {error && (
                        <div style={{
                            color: '#b91c1c',
                            backgroundColor: '#fef2f2',
                            padding: '10px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            marginBottom: '15px',
                            border: '1px solid #fecaca'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="book-cancel-button"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#fff',
                                color: '#64748b',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !purpose.trim()}
                            className="book-confirm-button"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: isSubmitting ? '#93c5fd' : '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default BookingFormModal;
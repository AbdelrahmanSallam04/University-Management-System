import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/StudentSidebar';
import StaffCard from './StaffCard';
import OfficeHoursModal from './OfficeHoursModal';
import '../styles/StaffDirectories.css';

const StaffDirectories = () => {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);

    useEffect(() => {
        fetchStaff();
    }, [filter]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:8080/api/staff-directory/';

            if (filter === 'professors') url += 'professors';
            else if (filter === 'tas') url += 'tas';
            else url += 'all';

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch staff');
            }

            const data = await response.json();
            setStaff(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching staff:', err);
            setError('Failed to load staff directory. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOfficeHours = (staffMember) => {
        setSelectedStaff(staffMember);
        // Prevent body scroll when modal is open
        document.body.classList.add('modal-open');
    };

    const handleCloseModal = () => {
        setSelectedStaff(null);
        // Re-enable body scroll when modal closes
        document.body.classList.remove('modal-open');
    };

    const handleBackToDashboard = () => {
        navigate('/student-dashboard');
    };

    const filteredStaff = staff.filter(staffMember => {
        if (!searchTerm.trim()) return true;

        const fullName = `${staffMember.firstName || ''} ${staffMember.lastName || ''}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return fullName.includes(searchLower) ||
               (staffMember.departmentName && staffMember.departmentName.toLowerCase().includes(searchLower)) ||
               (staffMember.email && staffMember.email.toLowerCase().includes(searchLower));
    });

    return (
        <div className="staff-directories-wrapper">
            <Sidebar />

            <div className="main-content">
                {/* Header Section */}
                <div className="staff-header">
                    <div className="header-content">
                        <h1>👨‍🏫 Staff Directory</h1>
                        <p>Browse and connect with professors and teaching assistants</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by name, department, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="header-buttons">
                            <button className="back-btn" onClick={handleBackToDashboard}>
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Staff
                    </button>
                    <button
                        className={`filter-btn ${filter === 'professors' ? 'active' : ''}`}
                        onClick={() => setFilter('professors')}
                    >
                        👨‍🏫 Professors
                    </button>
                    <button
                        className={`filter-btn ${filter === 'tas' ? 'active' : ''}`}
                        onClick={() => setFilter('tas')}
                    >
                        👨‍🎓 Teaching Assistants
                    </button>
                </div>

                {/* Results Count */}
                <div className="results-count">
                    Showing {filteredStaff.length} {filter === 'all' ? 'staff members' : filter}
                    {searchTerm && ` matching "${searchTerm}"`}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <p>Loading staff directory...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="error-section">
                        <p>{error}</p>
                        <button onClick={fetchStaff} className="retry-button">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Staff Grid */}
                {!loading && !error && (
                    <div className="staff-container">
                        {filteredStaff.length === 0 ? (
                            <div className="no-staff">
                                <div className="no-staff-icon">👥</div>
                                <h3>No staff members found</h3>
                                <p>Try adjusting your search or filter</p>
                            </div>
                        ) : (
                            <div className="staff-grid">
                                {filteredStaff.map((staffMember) => (
                                    <div key={staffMember.id} className="staff-grid-item">
                                        <StaffCard
                                            staffMember={staffMember}
                                            onViewOfficeHours={handleViewOfficeHours}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Office Hours Modal - Rendered at root level */}
            {selectedStaff && (
                <OfficeHoursModal
                    staffMember={selectedStaff}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default StaffDirectories;
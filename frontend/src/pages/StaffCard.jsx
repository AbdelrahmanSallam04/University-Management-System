import React, { useState } from 'react';
import OfficeHoursModal from './OfficeHoursModal';
import '../styles/StaffCard.css';

const StaffCard = ({ staffMember }) => {
    const [showOfficeHours, setShowOfficeHours] = useState(false);

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getRoleBadge = (staffType) => {
        switch(staffType) {
            case 'Professor': return '👨‍🏫 Professor';
            case 'Teaching Assistant': return '👨‍🎓 TA';
            default: return '👤 Staff';
        }
    };

    const getRoleColor = (staffType) => {
        switch(staffType) {
            case 'Professor': return '#3498db';
            case 'Teaching Assistant': return '#2ecc71';
            default: return '#95a5a6';
        }
    };

    const getCoursesLabel = (staffType) => {
        switch(staffType) {
            case 'Professor': return 'Teaching:';
            case 'Teaching Assistant': return 'Assisting:';
            default: return 'Courses:';
        }
    };

    return (
        <>
            <div className="staff-card" data-role={staffMember.staffType?.toLowerCase()}>
                <div className="course-card">
                    <div className="staff-avatar-container">
                        <div
                            className="staff-avatar"
                            style={{
                                background: `linear-gradient(135deg, ${getRoleColor(staffMember.staffType)} 0%, #${getRoleColor(staffMember.staffType).slice(1)}99 100%)`
                            }}
                        >
                            {getInitials(staffMember.firstName, staffMember.lastName)}
                        </div>
                        <div className="staff-role-badge">
                            {getRoleBadge(staffMember.staffType)}
                        </div>
                    </div>

                    <div className="staff-info">
                        <h3 className="staff-name">
                            {staffMember.firstName} {staffMember.lastName}
                        </h3>

                        <div className="staff-details">
                            {staffMember.email && (
                                <div className="detail-item">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value email">{staffMember.email}</span>
                                </div>
                            )}

                            {staffMember.departmentName && (
                                <div className="detail-item">
                                    <span className="detail-label">Department:</span>
                                    <span className="detail-value">{staffMember.departmentName}</span>
                                </div>
                            )}
                        </div>

                        {staffMember.courses && staffMember.courses.length > 0 && (
                            <div className="courses-section">
                                <h4>{getCoursesLabel(staffMember.staffType)}</h4>
                                <div className="courses-list">
                                    {staffMember.courses.slice(0, 3).map((course, index) => (
                                        <span key={index} className="course-tag">
                                            {course.code}: {course.name}
                                        </span>
                                    ))}
                                    {staffMember.courses.length > 3 && (
                                        <span className="course-tag more">
                                            +{staffMember.courses.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            className={`office-hours-btn ${!staffMember.hasOfficeHours ? 'no-hours' : ''}`}
                            onClick={() => setShowOfficeHours(true)}
                            disabled={!staffMember.hasOfficeHours}
                        >
                            {staffMember.hasOfficeHours ? '📅 View Office Hours' : 'No Office Hours'}
                        </button>
                    </div>
                </div>
            </div>

            {showOfficeHours && (
                <OfficeHoursModal
                    staffMember={staffMember}
                    onClose={() => setShowOfficeHours(false)}
                />
            )}
        </>
    );
};

export default StaffCard;
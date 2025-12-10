import React from "react";
import "../styles/RegistrationModal.css";

const RegistrationModal = ({
  course,
  isOpen,
  onClose,
  onConfirm,
  isRegistering
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Register for Course</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Course Details */}
        <div className="course-details">
          <div className="detail-row">
            <span className="label">Course Code:</span>
            <span className="value">{course.code}</span>
          </div>

          <div className="detail-row">
            <span className="label">Course Name:</span>
            <span className="value">{course.name}</span>
          </div>

          <div className="detail-row">
            <span className="label">Description:</span>
            <span className="value description">{course.description}</span>
          </div>

          <div className="detail-row">
            <span className="label">Credit Hours:</span>
            <span className="value">{course.creditHours} credits</span>
          </div>

          <div className="detail-row">
            <span className="label">Course Type:</span>
            <span className="value">{course.courseType}</span>
          </div>

          {course.departmentName && (
            <div className="detail-row">
              <span className="label">Department:</span>
              <span className="value">{course.departmentName}</span>
            </div>
          )}

          {course.professorName && (
            <div className="detail-row">
              <span className="label">Professor:</span>
              <span className="value">{course.professorName}</span>
            </div>
          )}

          {/* Show enrollment info if available */}
          {course.capacity !== undefined && (
            <div className="detail-row">
              <span className="label">Enrollment:</span>
              <span className="value">
                {course.currentEnrollment || 0} / {course.capacity || 'Unlimited'} students
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={isRegistering}
          >
            Cancel
          </button>

          <button
            className="confirm-btn"
            onClick={() => onConfirm(course.courseId, course.code)}
            disabled={isRegistering}
          >
            {isRegistering ? (
              <>
                <span className="spinner"></span>
                Registering...
              </>
            ) : (
              'Confirm Registration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
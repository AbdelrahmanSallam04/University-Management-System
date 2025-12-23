// src/components/RegistrationStatus.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/RegistrationStatus.css";

const RegistrationStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrationStatus();
  }, []);

  const fetchRegistrationStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/registration/status",
        { withCredentials: true }
      );

      if (response.data.success) {
        setStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error fetching registration status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading status...</div>;
  if (!status) return <div className="error">Unable to load registration status</div>;

  const creditPercentage = (status.totalCredits / status.maxCredits) * 100;

  return (
    <div className="registration-status">
      <h3>📊 Registration Status</h3>
      <div className="status-grid">
        <div className="status-item">
          <span className="label">Term:</span>
          <span className="value">{status.term}</span>
        </div>
        <div className="status-item">
          <span className="label">Enrolled Courses:</span>
          <span className="value">{status.enrolledCourses}</span>
        </div>
        <div className="status-item">
          <span className="label">Total Credits:</span>
          <span className="value">{status.totalCredits} / {status.maxCredits}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.registrationOpen ? 'open' : 'closed'}`}>
            {status.registrationOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>
      <button
        onClick={fetchRegistrationStatus}
        className="refresh-btn"
      >
        Refresh Status
      </button>
    </div>
  );
};

export default RegistrationStatus;
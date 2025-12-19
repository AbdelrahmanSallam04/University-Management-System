import React, { useState, useEffect } from 'react';
import { fetchAllReports, updateStatus, updatePriority } from '../services/maintenanceService';
import '../styles/MaintenanceManagement.css';
import {fetchUserBookings} from "../services/roomService";

const MaintenanceManagement = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [message, setMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    useEffect(() => { loadReports(); }, []);

    useEffect(() => {
        let result = reports;
        if (filterStatus !== 'all') {
            result = result.filter(r => r.statusId?.toString() === filterStatus);
        }
        if (filterPriority !== 'all') {
            result = result.filter(r => r.priorityId?.toString() === filterPriority);
        }
        setFilteredReports(result);
    }, [reports, filterStatus, filterPriority]);

    const loadReports = async () => {
        try {
            const data = await fetchAllReports();
            setReports(data);
        } catch (err) { console.error("Error loading reports", err); }
    };

    const handleStatusChange = async (reportId, statusId) => {
        try {
            // Passing object to match your maintenanceService.js
            await updateStatus({ id: reportId, statusId: parseInt(statusId) });
            setMessage("Status updated and assigned to you!");
            await loadReports();
        } catch (err) { setMessage("Failed to update status."); }
    };

    const handlePriorityChange = async (reportId, priorityId) => {
        try {
            await updatePriority({ id: reportId, priorityId: Number(priorityId) });
            setMessage("Priority updated!");
            await loadReports();
        } catch (err) { setMessage("Failed to update priority."); }
    };

    return (
        <div className="admin-maintenance-view">
            <h2>Campus Maintenance Management</h2>

            <div className="filter-bar">
                <div className="filter-group">
                    <label>Status:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="1">Pending</option>
                        <option value="2">In Progress</option>
                        <option value="3">Done</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Priority:</label>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                        <option value="all">All Priorities</option>
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>
                </div>
            </div>

            {message && <div className={`info-banner ${message.includes('failed') ? 'error' : 'success'}`}>{message}</div>}

            <table className="maintenance-table">
                <thead>
                <tr>
                    <th>Room</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reporter</th>
                    <th>Assigned Admin</th>
                </tr>
                </thead>
                <tbody>
                {filteredReports.map(report => (
                    // inside the .map loop:
                    <tr key={report.id}>
                        {/* Room should be visible now because we use roomName from the DTO */}
                        <td>{report.roomName}</td>
                        <td>{report.description}</td>
                        <td>
                            <select
                                className={`priority-badge p-${report.priorityId}`} // matches CSS p-1, p-2, p-3
                                value={report.priorityId}
                                onChange={(e) => handlePriorityChange(report.id, e.target.value)}
                            >
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>
                            </select>
                        </td>
                        <td>
                            <select
                                className={`status-badge s-${report.statusId}`} // matches CSS s-1, s-2, s-3
                                value={report.statusId}
                                onChange={(e) => handleStatusChange(report.id, e.target.value)}
                            >
                                <option value="1">Pending</option>
                                <option value="2">In Progress</option>
                                <option value="3">Done</option>
                            </select>
                        </td>
                        <td>{report.reporterName}</td>
                        <td>{report.adminName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaintenanceManagement;
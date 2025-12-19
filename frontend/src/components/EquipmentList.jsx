import React from 'react';
import '../styles/ResourceManagement.css';

const EquipmentList = ({ equipment, filterType, loading }) => {

    const getAllocationLabel = () => {
        return filterType === 'department' ? 'Department' :
            filterType === 'faculty member' ? 'Faculty Member' :
                'Student';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading equipment data...</p>
            </div>
        );
    }

    if (!equipment || equipment.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Equipment Found</h3>
                <p>No equipment allocated to {filterType}s at the moment.</p>
            </div>
        );
    }

    return (
        <div className="equipment-table-container">
            <table className="equipment-table">
                <thead>
                <tr>
                    <th>Equipment Name</th>
                    <th>{getAllocationLabel()}</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {equipment.map((item) => (
                    <tr key={item.id || item.equipmentId}>
                        <td className="equipment-name">
                            <strong>{item.name || 'Unnamed Equipment'}</strong>
                            {item.description && (
                                <div className="equipment-description">{item.description}</div>
                            )}
                        </td>
                        <td className="allocated-to">
                            <div className="allocated-name">
                                {filterType === 'department'
                                    ? (item.allocatedToFirstName || 'Not allocated')
                                    : `${item.allocatedToFirstName || ''} ${item.allocatedToLastName || ''}`.trim() || 'Not allocated'
                                }
                            </div>
                            {filterType === 'department' && (
                                <div className="department-code">Dept ID: {item.allocatedEntityId}</div>
                            )}
                        </td>
                        <td className="action-buttons">
                            <button
                                className="btn-action btn-view"
                                title="View Details"
                            >
                                👁️
                            </button>
                            <button
                                className="btn-action btn-edit"
                                title="Edit Allocation"
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-action btn-transfer"
                                title="Transfer Equipment"
                            >
                                🔄
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentList;
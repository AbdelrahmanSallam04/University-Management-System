import React, { useState } from 'react';
import '../styles/ResourceManagement.css';
import { fetchEquipmentDetails } from "../services/equipmentService";

const EquipmentList = ({ equipment, filterType, loading }) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedData, setExpandedData] = useState({});
    const [loadingAttributes, setLoadingAttributes] = useState({});

    const getAllocationLabel = () => {
        return filterType === 'department' ? 'Department' :
            filterType === 'faculty member' ? 'Faculty Member' :
                'Student';
    };

    const handleExpandClick = async (equipmentId) => {
        if (expandedRow === equipmentId) {
            setExpandedRow(null);
        } else {
            setExpandedRow(equipmentId);
            setLoadingAttributes(prev => ({ ...prev, [equipmentId]: true }));

            try {
                const attributes = await fetchEquipmentDetails(equipmentId);
                setExpandedData(prev => ({
                    ...prev,
                    [equipmentId]: attributes
                }));
            } catch (error) {
                console.error(`Error fetching details for equipment ${equipmentId}:`, error);
                setExpandedData(prev => ({
                    ...prev,
                    [equipmentId]: []
                }));
            } finally {
                setLoadingAttributes(prev => ({ ...prev, [equipmentId]: false }));
            }
        }
    };

    const formatAllocatedName = (item) => {
        if (filterType === 'department') {
            return item.allocatedToFirstName || `Department ${item.allocatedEntityId}`;
        } else {
            const fullName = `${item.allocatedToFirstName || ''} ${item.allocatedToLastName || ''}`.trim();
            return fullName || (filterType === 'faculty' ? `Faculty ${item.allocatedEntityId}` : `Student ${item.allocatedEntityId}`);
        }
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
                    <th style={{ width: '50px' }}></th>
                    <th>Equipment Name</th>
                    <th>{getAllocationLabel()}</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {equipment.map((item) => {
                    const isExpanded = expandedRow === item.equipmentId;
                    const isLoading = loadingAttributes[item.equipmentId];
                    const attributes = expandedData[item.equipmentId] || [];

                    return (
                        <React.Fragment key={item.equipmentId}>
                            {/* Main Row */}
                            <tr className={`equipment-row ${isExpanded ? 'expanded' : ''}`}>
                                <td className="expand-cell">
                                    <button
                                        className="expand-button"
                                        onClick={() => handleExpandClick(item.equipmentId)}
                                        aria-expanded={isExpanded}
                                        title={isExpanded ? "Hide details" : "Show details"}
                                    >
                                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                                            {isLoading ? '⏳' : (isExpanded ? '▼' : '▶')}
                                        </span>
                                    </button>
                                </td>
                                <td className="equipment-name">
                                    <strong>{item.name || 'Unnamed Equipment'}</strong>
                                    <div className="equipment-id">ID: {item.equipmentId}</div>
                                </td>
                                <td className="allocated-to">
                                    <div className="allocated-name">
                                        {formatAllocatedName(item)}
                                    </div>
                                    {filterType === 'department' && item.allocatedEntityId && (
                                        <div className="department-code">Dept ID: {item.allocatedEntityId}</div>
                                    )}
                                    {(filterType === 'faculty' || filterType === 'student') && item.allocatedEntityId && (
                                        <div className="entity-id">ID: {item.allocatedEntityId}</div>
                                    )}
                                </td>
                                <td className="action-buttons">
                                    <button
                                        className="btn-action btn-view"
                                        title={isExpanded ? "Hide Details" : "View Details"}
                                        onClick={() => handleExpandClick(item.equipmentId)}
                                    >
                                        {isExpanded ? '👁️ Hide' : '👁️ View'}
                                    </button>
                                    <button
                                        className="btn-action btn-edit"
                                        title="Delete Allocation"
                                    >
                                        ❌ Delete
                                    </button>
                                </td>
                            </tr>

                            {/* Expanded Details Row */}
                            {isExpanded && (
                                <tr className="details-row">
                                    <td colSpan="4" className="details-cell">
                                        <div className="attributes-container">
                                            {isLoading ? (
                                                <div className="loading-attributes">
                                                    <div className="small-spinner"></div>
                                                    <p>Loading equipment details...</p>
                                                </div>
                                            ) : attributes.length > 0 ? (
                                                <>
                                                    <div className="attributes-header">
                                                        <h4 className="attributes-title">
                                                            <span className="title-icon">📋</span>
                                                            Equipment Details
                                                        </h4>
                                                        <div className="attributes-count">
                                                            {attributes.length} Attribute{attributes.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                    <div className="specifications-table">
                                                        <div className="specifications-header">
                                                            <div className="spec-name-col">Attribute</div>
                                                            <div className="spec-value-col">Details</div>
                                                        </div>
                                                        <div className="specifications-body">
                                                            {attributes.map((attr, index) => {
                                                                const attributeName = attr.equipmentAttributeName || 'Specification'
                                                                const attributeValue = attr.equipmentValueName || 'N/A';

                                                                return (
                                                                    <div key={attr.equipmentValueId || index} className="spec-row">
                                                                        <div className="spec-name">
                                                                            {attributeName}
                                                                        </div>
                                                                        <div className="spec-value">
                                                                            {attributeValue}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="no-attributes">
                                                    <div className="no-data-icon">📝</div>
                                                    <p>No specifications available for this equipment.</p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentList;
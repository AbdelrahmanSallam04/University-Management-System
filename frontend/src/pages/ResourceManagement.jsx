import React, { useState, useEffect } from 'react';
import EquipmentFilter from '../components/EquipmentFilter';
import EquipmentList from '../components/EquipmentList';
import '../styles/ResourceManagement.css';
import {fetchEquipmentByFilter} from "../services/equipmentService";

const ResourcesManagement = () => {
    const [selectedFilter, setSelectedFilter] = useState('department');
    const [equipmentData, setEquipmentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch equipment data when filter changes
    useEffect(() => {
        const loadEquipmentData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchEquipmentByFilter(selectedFilter);
                setEquipmentData(data);
            } catch (err) {
                console.error('Failed to load equipment data:', err);
                setError('Failed to load equipment data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadEquipmentData();
    }, [selectedFilter]);

    const handleFilterChange = (filterType) => {
        setSelectedFilter(filterType);
    };

    return (
        <div className="resources-management">
            <div className="page-header">
                <h1>📦 Resources Management</h1>
            </div>

            <EquipmentFilter
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
            />

            <div className="content-section">
                <div className="section-header">
                    <h2>
                        {selectedFilter === 'department' ? '🏛️ Department Equipment' :
                            selectedFilter === 'faculty' ? '👨‍🏫 Faculty Equipment' :
                                '🎓 Student Equipment'}
                    </h2>
                    <span className="badge count-badge">
                        {loading ? '...' : equipmentData.length} items
                    </span>
                </div>

                {error && (
                    <div className="alert alert-warning">
                        ⚠️ {error}
                    </div>
                )}

                <EquipmentList
                    equipment={equipmentData}
                    filterType={selectedFilter}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ResourcesManagement;
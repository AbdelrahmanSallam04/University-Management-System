import React from 'react';
import '../styles/ResourceManagement.css';

const EquipmentFilter = ({ selectedFilter, onFilterChange }) => {
    const filters = [
        { id: 'department', label: '🏛️ Department', description: 'Equipment allocated to departments' },
        { id: 'faculty', label: '👨‍🏫 Faculty', description: 'Equipment allocated to faculty members' },
        { id: 'student', label: '🎓 Student', description: 'Equipment allocated to students' }
    ];

    return (
        <div className="filter-section">
            <h3 className="filter-title">Filter By Allocation Type</h3>
            <div className="filter-buttons">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-button ${selectedFilter === filter.id ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.id)}
                        title={filter.description}
                    >
                        <span className="filter-icon">{filter.label.split(' ')[0]}</span>
                        <span className="filter-label">{filter.label.split(' ')[1]}</span>
                        {selectedFilter === filter.id && (
                            <span className="filter-indicator">✓</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EquipmentFilter;
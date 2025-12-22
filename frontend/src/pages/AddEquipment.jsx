import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    fetchAllAttributes,
    fetchAllDepartments,
    searchFaculty,
    searchStudents,
    addNewEquipment
} from '../services/equipmentService';
import '../styles/AddEquipment.css';

const AddEquipment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialFilter = location.state?.filterType || 'department';

    // Form state
    const [formData, setFormData] = useState({
        equipmentName: '',
        allocatedToType: initialFilter, // 'department', 'faculty', or 'student'
        allocatedToId: '',
        attributes: [] // Array of { attributeId: '', attributeValue: '' }
    });

    // UI state
    const [loading, setLoading] = useState({
        attributes: false,
        departments: false,
        faculty: false,
        students: false,
        submitting: false
    });
    const [dropdownData, setDropdownData] = useState({
        attributes: [],
        departments: [],
        faculty: [],
        students: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch initial data based on filter type
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Always load attributes
                setLoading(prev => ({ ...prev, attributes: true }));
                const attributes = await fetchAllAttributes();
                setDropdownData(prev => ({ ...prev, attributes }));

                // Load departments if department filter
                if (initialFilter === 'department') {
                    setLoading(prev => ({ ...prev, departments: true }));
                    const departments = await fetchAllDepartments();
                    setDropdownData(prev => ({ ...prev, departments }));
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setLoading(prev => ({ ...prev, attributes: false, departments: false }));
            }
        };

        loadInitialData();
    }, [initialFilter]);

    // Handle filter type change
    const handleFilterChange = (filterType) => {
        setFormData(prev => ({
            ...prev,
            allocatedToType: filterType,
            allocatedToId: '',
            attributes: []
        }));
        setSelectedEntity(null);
        setSearchTerm('');
        setDropdownData(prev => ({ ...prev, faculty: [], students: [] }));
        setErrors({});
    };

    // Handle search for faculty/students
    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        const key = formData.allocatedToType === 'faculty' ? 'faculty' : 'students';
        setLoading(prev => ({ ...prev, [key]: true }));

        try {
            const data = formData.allocatedToType === 'faculty'
                ? await searchFaculty(searchTerm)
                : await searchStudents(searchTerm);

            setDropdownData(prev => ({ ...prev, [key]: data }));
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    // Handle entity selection (department, faculty, or student)
    const handleEntitySelect = (entity) => {
        setSelectedEntity(entity);
        setFormData(prev => ({
            ...prev,
            allocatedToId: entity[
                formData.allocatedToType === 'department' ? 'departmentId' :
                    formData.allocatedToType === 'faculty' ? 'facultyId' : 'studentId'
                ]
        }));
        setSearchTerm(
            formData.allocatedToType === 'department' ? entity.departmentName :
                `${entity.firstName} ${entity.lastName} (${entity.email})`
        );
    };

    // Add a new attribute field
    const handleAddAttribute = () => {
        setFormData(prev => ({
            ...prev,
            attributes: [...prev.attributes, { attributeId: '', attributeValue: '' }]
        }));
    };

    // Update an attribute
    const handleAttributeChange = (index, field, value) => {
        const updatedAttributes = [...formData.attributes];
        updatedAttributes[index][field] = field === 'attributeId' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, attributes: updatedAttributes }));
    };

    // Remove an attribute
    const handleRemoveAttribute = (index) => {
        const updatedAttributes = formData.attributes.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, attributes: updatedAttributes }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.equipmentName.trim()) {
            newErrors.equipmentName = 'Equipment name is required';
        }

        if (!formData.allocatedToId) {
            newErrors.allocatedTo = `Please select a ${formData.allocatedToType}`;
        }

        // Validate attributes
        formData.attributes.forEach((attr, index) => {
            if (!attr.attributeId) {
                newErrors[`attribute_${index}`] = 'Please select an attribute';
            }
            if (!attr.attributeValue.trim()) {
                newErrors[`value_${index}`] = 'Value is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(prev => ({ ...prev, submitting: true }));
        setErrors({});
        setSuccessMessage('');

        try {
            await addNewEquipment(formData);

            setSuccessMessage('✅ Equipment added successfully!');

            // Reset form after 2 seconds and redirect
            setTimeout(() => {
                navigate('/admin/resources-management');
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({
                submit: error.response?.data?.message || 'Failed to add equipment. Please try again.'
            });
        } finally {
            setLoading(prev => ({ ...prev, submitting: false }));
        }
    };

    // Render entity selection based on filter type
    const renderEntitySelector = () => {
        switch (formData.allocatedToType) {
            case 'department':
                return (
                    <div className="form-group">
                        <label className="form-label">Select Department *</label>
                        <select
                            className="form-control"
                            value={formData.allocatedToId}
                            onChange={(e) => {
                                const dept = dropdownData.departments.find(d => d.departmentId === parseInt(e.target.value));
                                handleEntitySelect(dept);
                            }}
                            disabled={loading.departments}
                        >
                            <option value="">-- Select Department --</option>
                            {dropdownData.departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName} ({dept.departmentCode})
                                </option>
                            ))}
                        </select>
                        {loading.departments && <small>Loading departments...</small>}
                        {errors.allocatedTo && <div className="error-text">{errors.allocatedTo}</div>}
                    </div>
                );

            case 'faculty':
            case 'student':
                return (
                    <div className="form-group">
                        <label className="form-label">
                            Search {formData.allocatedToType === 'faculty' ? 'Faculty' : 'Student'} *
                        </label>
                        <div className="search-container">
                            <div className="search-input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Enter ${formData.allocatedToType === 'faculty' ? 'faculty' : 'student'} name or email`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    type="button"
                                    className="search-btn"
                                    onClick={handleSearch}
                                    disabled={loading.faculty || loading.students}
                                >
                                    {loading.faculty || loading.students ? 'Searching...' : '🔍 Search'}
                                </button>
                            </div>

                            {errors.allocatedTo && <div className="error-text">{errors.allocatedTo}</div>}

                            {/* Search Results */}
                            {dropdownData[formData.allocatedToType + 's']?.length > 0 && (
                                <div className="search-results">
                                    <h4>Search Results:</h4>
                                    <div className="results-list">
                                        {dropdownData[formData.allocatedToType + 's'].map(entity => (
                                            <div
                                                key={entity[formData.allocatedToType === 'faculty' ? 'facultyId' : 'studentId']}
                                                className={`result-item ${selectedEntity === entity ? 'selected' : ''}`}
                                                onClick={() => handleEntitySelect(entity)}
                                            >
                                                <div className="entity-name">
                                                    {entity.firstName} {entity.lastName}
                                                </div>
                                                <div className="entity-email">{entity.email}</div>
                                                {entity.departmentName && (
                                                    <div className="entity-department">{entity.departmentName}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected Entity Display */}
                            {selectedEntity && (
                                <div className="selected-entity">
                                    <div className="selected-label">Selected:</div>
                                    <div className="selected-info">
                                        <strong>{selectedEntity.firstName} {selectedEntity.lastName}</strong>
                                        <div>{selectedEntity.email}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="add-equipment-container">
            <div className="page-header">
                <button
                    className="back-button"
                    onClick={() => navigate('/admin/resources-management')}
                >
                    ← Back to Resources
                </button>
                <h1>➕ Add New Equipment</h1>
                <p className="page-subtitle">Add equipment with attributes and allocation</p>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    {/* Filter Selection */}
                    <div className="filter-section">
                        <h3>Allocation Type</h3>
                        <div className="filter-buttons">
                            {['department', 'faculty', 'student'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`filter-btn ${formData.allocatedToType === type ? 'active' : ''}`}
                                    onClick={() => handleFilterChange(type)}
                                >
                                    {type === 'department' ? '🏛️ Department' :
                                        type === 'faculty' ? '👨‍🏫 Faculty' : '🎓 Student'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic Equipment Info */}
                    <div className="form-section">
                        <h3>Equipment Information</h3>
                        <div className="form-group">
                            <label className="form-label">Equipment Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Dell Laptop XPS 15"
                                value={formData.equipmentName}
                                onChange={(e) => setFormData(prev => ({ ...prev, equipmentName: e.target.value }))}
                            />
                            {errors.equipmentName && <div className="error-text">{errors.equipmentName}</div>}
                        </div>
                    </div>

                    {/* Entity Selection */}
                    <div className="form-section">
                        <h3>Allocation Details</h3>
                        {renderEntitySelector()}
                    </div>

                    {/* Attributes Section */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3>Equipment Attributes</h3>
                            <button
                                type="button"
                                className="add-attribute-btn"
                                onClick={handleAddAttribute}
                            >
                                + Add Attribute
                            </button>
                        </div>

                        <div className="attributes-container">
                            {formData.attributes.length === 0 ? (
                                <div className="no-attributes">
                                    <div className="empty-icon">📝</div>
                                    <p>No attributes added yet. Click "Add Attribute" to add specifications.</p>
                                </div>
                            ) : (
                                formData.attributes.map((attr, index) => (
                                    <div key={index} className="attribute-row">
                                        <div className="attribute-fields">
                                            <div className="form-group">
                                                <label className="form-label">Attribute</label>
                                                <select
                                                    className="form-control"
                                                    value={attr.attributeId || ''}
                                                    onChange={(e) => handleAttributeChange(index, 'attributeId', e.target.value)}
                                                    disabled={loading.attributes}
                                                >
                                                    <option value="">-- Select Attribute --</option>
                                                    {dropdownData.attributes.map(attribute => (
                                                        <option key={attribute.attributeId} value={attribute.attributeId}>
                                                            {attribute.attributeName}
                                                            {attribute.description && ` - ${attribute.description}`}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`attribute_${index}`] && (
                                                    <div className="error-text">{errors[`attribute_${index}`]}</div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Value</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter value"
                                                    value={attr.attributeValue}
                                                    onChange={(e) => handleAttributeChange(index, 'attributeValue', e.target.value)}
                                                />
                                                {errors[`value_${index}`] && (
                                                    <div className="error-text">{errors[`value_${index}`]}</div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="remove-attribute-btn"
                                            onClick={() => handleRemoveAttribute(index)}
                                            title="Remove attribute"
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="submit-section">
                        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}

                        <div className="action-buttons">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/admin/resources-management')}
                                disabled={loading.submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading.submitting}
                            >
                                {loading.submitting ? (
                                    <>
                                        <span className="spinner"></span> Adding Equipment...
                                    </>
                                ) : (
                                    '✅ Add Equipment'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEquipment;
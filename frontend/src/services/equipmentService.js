import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Fetch equipment by filter type (department, faculty, student)
export const fetchEquipmentByFilter = async (filterType) => {
    try {
        const endpoint = filterType === 'department' ? 'departments' :
            filterType === 'faculty' ? 'faculty' : 'students';

        const response = await axios.get(`${API_BASE_URL}/equipments/filters/${endpoint}`);
        return response.data.map(item => ({
            equipmentId: item.equipmentId,
            name: item.equipmentName,
            allocatedToFirstName: item.allocatedToFirstName,
            allocatedToLastName: item.allocatedToLastName,
            allocatedEntityId: item.allocatedEntityId
        }));
    } catch (error) {
        console.error(`Error fetching ${filterType} equipment:`, error);
        throw error;
    }
};

export const fetchEquipmentDetails = async (equipmentId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/equipments/${equipmentId}`);
        return response.data.map(item => ({
            equipmentId: item.equipmentId,
            equipmentName: item.equipmentName,
            equipmentAttributeId: item.equipmentAttributeId,
            equipmentAttributeName: item.equipmentAttributeName,
            equipmentValueId: item.equipmentValueId,
            equipmentValueName: item.equipmentValueName,
        }));
    } catch (error) {
        console.error(`Error fetching equipment ${equipmentId} details:`, error);
        throw error;
    }
};

// Get all attributes for dropdown
export const fetchAllAttributes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/equipments/attributes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching attributes:', error);
        throw error;
    }
};

// Get all departments for dropdown
export const fetchAllDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/equipments/departments/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

// Search faculty by email or name
export const searchFaculty = async (searchTerm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/equipments/faculty/search`, {
            params: {
                name: searchTerm
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching faculty:', error);
        throw error;
    }
};

// Search students by email or name
export const searchStudents = async (searchTerm) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/equipments/students/search`, {
            params: {
                name: searchTerm
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching students:', error);
        throw error;
    }
};

// Add new equipment
export const addNewEquipment = async (equipmentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/equipments/add`, equipmentData);
        return response.data;
    } catch (error) {
        console.error('Error adding equipment:', error);
        throw error;
    }
};
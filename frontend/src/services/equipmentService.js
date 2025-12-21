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
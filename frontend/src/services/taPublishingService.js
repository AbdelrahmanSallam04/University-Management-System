import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/ta';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

export const taPublishingService = {

    /**
     * Get all courses that the TA is assisting
     */
    async getAssistingCourses() {
        try {
            const response = await axios.get(`${API_BASE_URL}/courses`);
            return response.data;
        } catch (error) {
            console.error('Error fetching TA courses:', error);
            throw error.response?.data || 'Failed to fetch courses';
        }
    },

    /**
     * Publish a new assignment
     */
    async publishAssignment(courseId, assignmentData) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/courses/${courseId}/assignments`,
                assignmentData
            );
            return response.data;
        } catch (error) {
            console.error('Error publishing assignment:', error);
            throw error.response?.data || 'Failed to publish assignment';
        }
    },

    /**
     * Publish a new exam
     */
    async publishExam(courseId, examData) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/courses/${courseId}/exams`,
                examData
            );
            return response.data;
        } catch (error) {
            console.error('Error publishing exam:', error);
            throw error.response?.data || 'Failed to publish exam';
        }
    },

    /**
     * Get course materials (assignments and exams)
     */
    async getCourseMaterials(courseId) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/courses/${courseId}/materials`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching course materials:', error);
            throw error.response?.data || 'Failed to fetch course materials';
        }
    }
};
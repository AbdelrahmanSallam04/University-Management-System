// services/parentService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session-based authentication
});

// Fetch parent dashboard data
export const getParentDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/parent');
    return response.data;
  } catch (error) {
    console.error('Error fetching parent dashboard:', error);
    throw error;
  }
};

// Fetch parent's children
export const getParentChildren = async () => {
  try {
    const response = await api.get('/dashboard/parent/children');
    return response.data;
  } catch (error) {
    console.error('Error fetching children:', error);
    throw error;
  }
};

// Fetch children's assignments
export const getChildrenAssignments = async () => {
  try {
    const response = await api.get('/dashboard/parent/assignments');
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

// Fetch children's grades
export const getChildrenGrades = async () => {
  try {
    const response = await api.get('/dashboard/parent/grades');
    return response.data;
  } catch (error) {
    console.error('Error fetching grades:', error);
    throw error;
  }
};

// Fetch data for a specific child
export const getChildData = async (childId) => {
  try {
    const response = await api.get(`/students/${childId}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching child data:', error);
    throw error;
  }
};
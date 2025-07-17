// API service for achievements
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const achievementsApi = {
  // Get all achievements
  getAllAchievements: async () => {
    try {
      const response = await axios.get(`${API_URL}/achievements`);
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },
  
  // Get achievements for a specific student
  getStudentAchievements: async (regNo) => {
    try {
      const response = await axios.get(`${API_URL}/achievements/student/${regNo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student achievements:', error);
      throw error;
    }
  },
  
  // Add a new achievement
  addAchievement: async (achievementData) => {
    try {
      // Format date if it's in DD/MM/YYYY format
      if (achievementData.achievement_date && achievementData.achievement_date.includes('/')) {
        // No need to modify as backend handles DD/MM/YYYY format
      }
      
      const response = await axios.post(`${API_URL}/achievements`, achievementData);
      return response.data;
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  },
  
  // Update an achievement
  updateAchievement: async (id, achievementData) => {
    try {
      // Format date if it's in DD/MM/YYYY format
      if (achievementData.achievement_date && achievementData.achievement_date.includes('/')) {
        // No need to modify as backend handles DD/MM/YYYY format
      }
      
      const response = await axios.put(`${API_URL}/achievements/${id}`, achievementData);
      return response.data;
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  },
  
  // Delete an achievement
  deleteAchievement: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/achievements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  },
  
  // Get link status
  getLinkStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/achievements/link-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching link status:', error);
      return { active: true }; // Default to active if error
    }
  },
  
  // Update link status
  updateLinkStatus: async (active) => {
    try {
      const response = await axios.post(`${API_URL}/achievements/link-status`, { active });
      return response.data;
    } catch (error) {
      console.error('Error updating link status:', error);
      throw error;
    }
  },
  
  // Export achievements to Excel
  exportToExcel: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categories) params.append('categories', filters.categories.join(','));
    if (filters.timeRange) params.append('timeRange', filters.timeRange);
    if (filters.includeDetails) params.append('includeDetails', filters.includeDetails);
    
    return `${API_URL}/achievements/export/excel?${params.toString()}`;
  },
  
  // Export achievements to PDF
  exportToPDF: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categories) params.append('categories', filters.categories.join(','));
    if (filters.timeRange) params.append('timeRange', filters.timeRange);
    if (filters.includeDetails) params.append('includeDetails', filters.includeDetails);
    if (filters.includeCharts) params.append('includeCharts', filters.includeCharts);
    
    return `${API_URL}/achievements/export/pdf?${params.toString()}`;
  },
  
  // Export achievements to CSV
  exportToCSV: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categories) params.append('categories', filters.categories.join(','));
    if (filters.timeRange) params.append('timeRange', filters.timeRange);
    if (filters.includeDetails) params.append('includeDetails', filters.includeDetails);
    
    return `${API_URL}/achievements/export/csv?${params.toString()}`;
  }
};
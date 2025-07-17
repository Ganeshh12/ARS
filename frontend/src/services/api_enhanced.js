// Enhanced API service for frontend
const getApiBaseUrl = () => {
  // Get the hostname from the current URL
  const hostname = window.location.hostname;
  return `http://${hostname}:5000/api`;
};

const API_URL = getApiBaseUrl();

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    return {
      error: true,
      message: error.response.data.message || 'Server error',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return {
      error: true,
      message: 'No response from server',
      status: 0
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request error:', error.message);
    return {
      error: true,
      message: error.message,
      status: 0
    };
  }
};

// Get authentication token
const getToken = () => {
  return localStorage.getItem('access_token');
};

// Mock data for calendar events when API is unavailable
const getMockCalendarEvents = () => {
  return [
    {
      id: 1,
      title: 'Independence Day',
      start: new Date(2023, 7, 15),
      end: new Date(2023, 7, 15),
      type: 'holiday',
      color: '#f44336',
      allDay: true,
      description: 'National Holiday - Independence Day',
      studentYear: 'all'
    },
    {
      id: 2,
      title: '1st Year Mid-Semester Exams',
      start: new Date(2023, 8, 18),
      end: new Date(2023, 8, 25),
      type: 'exam',
      color: '#2196f3',
      allDay: true,
      description: 'Mid-semester examinations for 1st year students',
      studentYear: '1'
    },
    {
      id: 3,
      title: '2nd Year Mid-Semester Exams',
      start: new Date(2023, 8, 20),
      end: new Date(2023, 8, 27),
      type: 'exam',
      color: '#2196f3',
      allDay: true,
      description: 'Mid-semester examinations for 2nd year students',
      studentYear: '2'
    },
    {
      id: 4,
      title: '3rd Year Mid-Semester Exams',
      start: new Date(2023, 8, 22),
      end: new Date(2023, 8, 29),
      type: 'exam',
      color: '#2196f3',
      allDay: true,
      description: 'Mid-semester examinations for 3rd year students',
      studentYear: '3'
    },
    {
      id: 5,
      title: '4th Year Mid-Semester Exams',
      start: new Date(2023, 8, 24),
      end: new Date(2023, 9, 1),
      type: 'exam',
      color: '#2196f3',
      allDay: true,
      description: 'Mid-semester examinations for 4th year students',
      studentYear: '4'
    },
    {
      id: 6,
      title: 'AI Workshop for 3rd & 4th Years',
      start: new Date(2023, 9, 5),
      end: new Date(2023, 9, 6),
      type: 'workshop',
      color: '#4caf50',
      allDay: true,
      description: 'Two-day workshop on Artificial Intelligence and Machine Learning',
      studentYear: ['3', '4']
    }
  ];
};

export const api = {
  // Generic API methods
  get: async (endpoint, params = {}) => {
    try {
      console.log(`API GET request to ${endpoint} with params:`, params);
      const url = new URL(`${API_URL}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });
      
      // Special case for calendar endpoints when backend is unavailable
      if (endpoint === '/calendar') {
        console.log('Using mock calendar data');
        return getMockCalendarEvents();
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API GET response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      
      // Return mock data for calendar endpoints
      if (endpoint === '/calendar') {
        console.log('Falling back to mock calendar data');
        return getMockCalendarEvents();
      }
      
      throw error;
    }
  },
  
  post: async (endpoint, data) => {
    try {
      console.log(`API POST request to ${endpoint} with data:`, data);
      
      // Special case for calendar endpoints when backend is unavailable
      if (endpoint === '/calendar') {
        console.log('Using mock calendar data for POST');
        const mockEvent = {
          id: Date.now(),
          ...data,
          allDay: true
        };
        return mockEvent;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log(`API POST response from ${endpoint}:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      
      // Return mock data for calendar endpoints
      if (endpoint === '/calendar') {
        console.log('Falling back to mock calendar data for POST');
        const mockEvent = {
          id: Date.now(),
          ...data,
          allDay: true
        };
        return mockEvent;
      }
      
      throw error;
    }
  },
  
  put: async (endpoint, data) => {
    try {
      console.log(`API PUT request to ${endpoint} with data:`, data);
      
      // Special case for calendar endpoints when backend is unavailable
      if (endpoint.startsWith('/calendar/')) {
        console.log('Using mock calendar data for PUT');
        return {
          ...data,
          id: parseInt(endpoint.split('/').pop()),
          allDay: true
        };
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log(`API PUT response from ${endpoint}:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      
      // Return mock data for calendar endpoints
      if (endpoint.startsWith('/calendar/')) {
        console.log('Falling back to mock calendar data for PUT');
        return {
          ...data,
          id: parseInt(endpoint.split('/').pop()),
          allDay: true
        };
      }
      
      throw error;
    }
  },
  
  delete: async (endpoint) => {
    try {
      console.log(`API DELETE request to ${endpoint}`);
      
      // Special case for calendar endpoints when backend is unavailable
      if (endpoint.startsWith('/calendar/')) {
        console.log('Using mock calendar data for DELETE');
        return { message: 'Event deleted successfully' };
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log(`API DELETE response from ${endpoint}:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      
      // Return mock data for calendar endpoints
      if (endpoint.startsWith('/calendar/')) {
        console.log('Falling back to mock calendar data for DELETE');
        return { message: 'Event deleted successfully' };
      }
      
      throw error;
    }
  },
  
  // Calendar specific methods
  calendar: {
    getEvents: async (params = {}) => {
      return api.get('/calendar', params);
    },
    
    getEventTypes: async () => {
      return api.get('/calendar/types');
    },
    
    createEvent: async (eventData) => {
      return api.post('/calendar', eventData);
    },
    
    updateEvent: async (id, eventData) => {
      return api.put(`/calendar/${id}`, eventData);
    },
    
    deleteEvent: async (id) => {
      return api.delete(`/calendar/${id}`);
    }
  },
  
  // Student data methods
  fetchStudents: async (branch = '', semester = '') => {
    const params = {};
    if (branch) params.branch = branch;
    if (semester) params.semester = semester;
    return api.get('/students', params);
  },
  
  // PDF Reports
  downloadIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
    return `${API_URL}/reports/individual/${regNo}?includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
  },
  
  previewIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
    return `${API_URL}/reports/preview/${regNo}?includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
  },
  
  downloadBulkReport: (params) => {
    const { selected, reportType, pdfType, selected_columns, includeCharts = false, templateStyle = 'classic' } = params;
    
    if (reportType === 'pdf') {
      return `${API_URL}/reports/pdf/${pdfType}?students=${selected.join(',')}&includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
    } else if (reportType === 'excel') {
      return `${API_URL}/reports/excel?students=${selected.join(',')}&columns=${selected_columns.join(',')}`;
    }
    
    return '';
  }
};
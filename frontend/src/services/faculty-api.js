// Faculty API service
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const facultyApi = {
  // Get dashboard data
  getDashboardData: async (filter = 'proctoring') => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      
      // Get username from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : { username: 'faculty' };
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('filter', filter);
      queryParams.append('username', user.username);
      
      console.log(`Fetching dashboard data with filter: ${filter}, username: ${user.username}`);
      
      const response = await fetch(`${API_URL}/faculty/dashboard?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`Dashboard of faculty : ${response}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Return mock data as fallback
      return {
        stats: {
          totalStudents: filter === 'all' ? 245 : 45,
          avgCGPA: 7.8,
          achievements: filter === 'all' ? 78 : 32,
          certifications: filter === 'all' ? 56 : 18
        },
        recentReports: [
          { id: 1, student_name: 'Anusuri Bharathi', report_type: 'Semester Performance', date: '2024-05-08' },
          { id: 2, student_name: 'Rahul Sharma', report_type: 'Achievements', date: '2024-05-07' },
          { id: 3, student_name: 'Priya Patel', report_type: 'Certifications', date: '2024-05-06' }
        ],
        performanceData: [
          { semester: 'Sem 1', avgSGPA: 8.2 },
          { semester: 'Sem 2', avgSGPA: 8.5 },
          { semester: 'Sem 3', avgSGPA: 8.3 },
          { semester: 'Sem 4', avgSGPA: 8.7 }
        ],
        branchDistribution: [
          { branch: 'CSE', count: filter === 'all' ? 120 : 20 },
          { branch: 'ECE', count: filter === 'all' ? 85 : 15 },
          { branch: 'IT', count: filter === 'all' ? 65 : 5 },
          { branch: 'MECH', count: filter === 'all' ? 45 : 3 },
          { branch: 'CIVIL', count: filter === 'all' ? 30 : 2 }
        ]
      };
    }
  },
  
  // Get students based on filter
  getStudents: async (params = {}) => {
    try {
      const { branch = '', semester = '', filter = 'proctoring' } = params;
      
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      
      // Get username from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : { username: 'faculty3' };
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (branch) queryParams.append('branch', branch);
      if (semester) queryParams.append('semester', semester);
      queryParams.append('filter', filter);
      queryParams.append('username', user.username);
      
      console.log(`Fetching students with filter: ${filter}, username: ${user.username}`);
      
      // Use students endpoint with filter parameter
      const response = await fetch(`${API_URL}/students-list?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data;
    } 
    catch (error) {
      console.error('Error fetching students:', error);
    }
  },
  
  // Get student details
  getStudentDetails: async (regNo) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      
      // Use /students endpoint for now since /faculty/students doesn't exist yet
      const endpoint = `/students/${regNo}`;
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching student details:', error);
      
    }
  },

  // Generate and fetch dummy certificate HTML
  generateDummyCertificate: async (certificateData) => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_URL}/certifications/generate-dummy-certificate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(certificateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Expect HTML text instead of image blob
      return await response.text();
    } catch (error) {
      console.error('Error generating dummy certificate:', error);
      throw error;
    }
  },

  uploadCertificate: async (formData) => {
    const response = await fetch(`${API_URL}/certifications/upload-certificate`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    const data = await response.json();
    return { filePath: data.url }; // normalize to match frontend expectations
  }



};

export default facultyApi;
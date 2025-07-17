// Report API service for frontend
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const reportApi = {
  // Fetch all students
  fetchStudents: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } 
    catch (error) {
      console.error('Error fetching students:', error);
    }
  },

  // Generate semester performance report
  getSemesterPerformanceReport: async (regNo, semester, academicYear) => {
    try {
      const token = localStorage.getItem('access_token');
      const url = new URL(`${API_URL}/reports/semester-performance/${regNo}`);
      
      if (semester) url.searchParams.append('semester', semester);
      if (academicYear) url.searchParams.append('academic_year', academicYear);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching semester performance report:', error);
      throw error;
    }
  },




  // For previewing reports 
  previewPdfReport: (students, reportType, templateStyle = 'classic', includeCharts = false) => {
    return `${API_URL}/reports/preview-pdf?students=${students.join(',')}&type=${reportType}&template=${templateStyle}&includeCharts=${includeCharts}`;
  },

  // For Downloading Reports: Handles both single and batch report downloads
  downloadPdfReport: (students, reportType, templateStyle = 'classic', includeCharts = false, isIndividual = true) => {
    const studentParam = Array.isArray(students) ? students.join(',') : students;
    return `${API_URL}/reports/download-pdf?students=${studentParam}&type=${reportType}&template=${templateStyle}&includeCharts=${includeCharts}&isIndividual=${isIndividual}`;
  },


  // Generate Excel report - no token needed
  generateExcelReport: (students, columns) => {
    return `${API_URL}/reports/excel?students=${students.join(',')}&columns=${columns.join(',')}`;
  },

  // Generate CSV report - no token needed
  generateCsvReport: (students, columns) => {
    return `${API_URL}/reports/csv?students=${students.join(',')}&columns=${columns.join(',')}`;
  },
  
  // Get report types
  getReportTypes: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/reports/types`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Return default report types if API fails
        return [
          { id: 'semester', name: 'Semester Performance Report' },
          { id: 'cumulative', name: 'Cumulative Performance Report' },
          { id: 'subject', name: 'Subject Analysis Report' },
          { id: 'achievements', name: 'Achievements Report' },
          { id: 'certifications', name: 'Certifications Report' },
          { id: 'backlog', name: 'Backlog Management Report' }
        ];
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching report types:', error);
      // Return default report types if API fails
      return [
        { id: 'semester', name: 'Semester Performance Report' },
        { id: 'cumulative', name: 'Cumulative Performance Report' },
        { id: 'subject', name: 'Subject Analysis Report' },
        { id: 'achievements', name: 'Achievements Report' },
        { id: 'certifications', name: 'Certifications Report' },
        { id: 'backlog', name: 'Backlog Management Report' }
      ];
    }
  }
};
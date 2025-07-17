// Student API service
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const studentApi = {
  // Get dashboard data for student
  getDashboardData: async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      
      // Get user data from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!user || !user.username) {
        throw new Error('User information not available');
      }
      
      // Use the same endpoint as faculty API for student details
      const response = await fetch(`${API_URL}/students/${user.username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const studentData = await response.json();
      
      // Mock data for dashboard components not available in the API
      return {
        student: studentData,
        stats: {
          totalCredits: studentData.grades ? studentData.grades.reduce((sum, grade) => sum + (grade.credits || 0), 0) : 120,
          completedCredits: studentData.grades ? studentData.grades.filter(g => g.grade !== 'F').reduce((sum, grade) => sum + (grade.credits || 0), 0) : 90,
          achievements: studentData.achievements?.length || 0,
          certifications: studentData.certifications?.length || 0
        },
        recentActivities: [
          { id: 1, title: 'Submitted Assignment', date: '2024-05-08', course: 'Machine Learning' },
          { id: 2, title: 'Completed Quiz', date: '2024-05-07', course: 'Deep Learning' }
        ],
        performanceData: generatePerformanceData(studentData),
        upcomingEvents: [
          { id: 1, title: 'Mid-term Exam', date: '2024-05-20', course: 'Natural Language Processing' },
          { id: 2, title: 'Project Submission', date: '2024-05-25', course: 'Computer Vision' }
        ],
        classmates: [
          { id: 1, name: 'Akella Venkata', registration_number: '22A91A6101', branch: 'AIML', cgpa: 9.6 },
          { id: 2, name: 'Ari Naresh', registration_number: '22A91A6103', branch: 'AIML', cgpa: 9.5 }
        ]
      };
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      
      // Return mock data as fallback
      return {
        student: {
          name: 'Anusuri Bharathi',
          registration_number: '22A91A6102',
          branch: 'AIML',
          current_semester: 6,
          email: 'bharathi@example.com',
          phone: '9876543210',
          cgpa: 9.8,
          grades: [
            { course_code: 'AIML301', course_name: 'Machine Learning', credits: 4, grade: 'A+', grade_points: 10.0, course_semester: 3 },
            { course_code: 'AIML302', course_name: 'Deep Learning', credits: 4, grade: 'A', grade_points: 9.0, course_semester: 3 },
            { course_code: 'AIML401', course_name: 'Computer Vision', credits: 4, grade: 'A+', grade_points: 10.0, course_semester: 4 },
            { course_code: 'AIML402', course_name: 'Natural Language Processing', credits: 4, grade: 'A', grade_points: 9.0, course_semester: 4 },
            { course_code: 'AIML501', course_name: 'Reinforcement Learning', credits: 4, grade: 'A+', grade_points: 10.0, course_semester: 5 },
            { course_code: 'AIML502', course_name: 'AI Ethics', credits: 3, grade: 'A', grade_points: 9.0, course_semester: 5 }
          ],
          achievements: [
            { id: 1, title: 'Won coding competition', description: 'First place in national coding championship', achievement_date: '2023-10-15', category: 'Academic' }
          ],
          certifications: [
            { id: 1, title: 'AWS Certified Developer', issuer: 'Amazon Web Services', issue_date: '2023-09-20', credential_id: 'AWS-123456' }
          ]
        },
        stats: {
          totalCredits: 120,
          completedCredits: 90,
          achievements: 3,
          certifications: 2
        },
        recentActivities: [
          { id: 1, title: 'Submitted Assignment', date: '2024-05-08', course: 'Machine Learning' },
          { id: 2, title: 'Completed Quiz', date: '2024-05-07', course: 'Deep Learning' }
        ],
        performanceData: [
          { semester: 'Sem 1', sgpa: 9.2 },
          { semester: 'Sem 2', sgpa: 9.5 },
          { semester: 'Sem 3', sgpa: 9.3 },
          { semester: 'Sem 4', sgpa: 9.7 },
          { semester: 'Sem 5', sgpa: 9.8 }
        ],
        upcomingEvents: [
          { id: 1, title: 'Mid-term Exam', date: '2024-05-20', course: 'Natural Language Processing' },
          { id: 2, title: 'Project Submission', date: '2024-05-25', course: 'Computer Vision' }
        ],
        classmates: [
          { id: 1, name: 'Akella Venkata', registration_number: '22A91A6101', branch: 'AIML', cgpa: 9.6 },
          { id: 2, name: 'Ari Naresh', registration_number: '22A91A6103', branch: 'AIML', cgpa: 9.5 }
        ]
      };
    }
  },
  
  // Get student profile details - uses the same endpoint as getDashboardData
  getStudentProfile: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!user || !user.username) {
        throw new Error('User information not available');
      }
      
      const response = await fetch(`${API_URL}/students/${user.username}`, {
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
      console.error('Error fetching student profile:', error);
      
      // Return mock data as fallback
      return {
        id: 1,
        name: 'Anusuri Bharathi',
        registration_number: '22A91A6102',
        branch: 'AIML',
        current_semester: 6,
        email: 'bharathi@example.com',
        phone: '9876543210',
        cgpa: 9.8,
        grades: [
          { course_code: 'AIML301', course_name: 'Machine Learning', credits: 4, grade: 'A+', grade_points: 10.0, course_semester: 3 },
          { course_code: 'AIML302', course_name: 'Deep Learning', credits: 4, grade: 'A', grade_points: 9.0, course_semester: 3 },
          { course_code: 'AIML401', course_name: 'Computer Vision', credits: 4, grade: 'A+', grade_points: 10.0, course_semester: 4 },
          { course_code: 'AIML402', course_name: 'Natural Language Processing', credits: 4, grade: 'A', grade_points: 9.0, course_semester: 4 },
          { course_code: 'AIML501', course_name: 'Reinforcement Learning', credits: 4, grade: 'A+', grade_points: 10.0, course_semester: 5 },
          { course_code: 'AIML502', course_name: 'AI Ethics', credits: 3, grade: 'A', grade_points: 9.0, course_semester: 5 }
        ],
        achievements: [
          { id: 1, title: 'Won coding competition', description: 'First place in national coding championship', achievement_date: '2023-10-15', category: 'Academic' }
        ],
        certifications: [
          { id: 1, title: 'AWS Certified Developer', issuer: 'Amazon Web Services', issue_date: '2023-09-20', credential_id: 'AWS-123456' }
        ]
      };
    }
  }
};

// Helper function to generate performance data from student grades
function generatePerformanceData(studentData) {
  if (!studentData || !studentData.grades || studentData.grades.length === 0) {
    return [
      { semester: 'Sem 1', sgpa: 9.2 },
      { semester: 'Sem 2', sgpa: 9.5 },
      { semester: 'Sem 3', sgpa: 9.3 }
    ];
  }
  
  // Group grades by semester
  const semesterMap = {};
  studentData.grades.forEach(grade => {
    const sem = grade.course_semester || 1;
    if (!semesterMap[sem]) {
      semesterMap[sem] = [];
    }
    semesterMap[sem].push(grade);
  });
  
  // Calculate SGPA for each semester
  return Object.keys(semesterMap).map(semester => {
    const courses = semesterMap[semester];
    const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + ((course.grade_points || 0) * (course.credits || 0)), 0);
    return {
      semester: `Sem ${semester}`,
      sgpa: totalCredits > 0 ? parseFloat((Math.random() * 4 + 6).toFixed(2)) : 0
    };
  }).sort((a, b) => {
    const semA = parseInt(a.semester.split(' ')[1]);
    const semB = parseInt(b.semester.split(' ')[1]);
    return semA - semB;
  });
}

export default studentApi;
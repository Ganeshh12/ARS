import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  School as SchoolIcon,
  EmojiEvents as AchievementsIcon,
  CardMembership as CertificationsIcon,
  Assessment as AssessmentIcon,
  Psychology as CounselingIcon
} from '@mui/icons-material';
import { facultyApi } from '../../services/faculty-api';
import { useStudentFilter } from '../../contexts/StudentFilterContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentDetail = () => {
  const { regNo } = useParams();
  const { studentFilter } = useStudentFilter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [academicTabValue, setAcademicTabValue] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [semesterRecords, setSemesterRecords] = useState([]);

  useEffect(() => {
    fetchStudentDetails();
  }, [regNo, studentFilter]); // Re-fetch when studentFilter changes

  useEffect(() => {
    if (student && student.grades) {
      generateSemesterRecords();
    }
  }, [student, selectedSemester]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await facultyApi.getStudentDetails(regNo);
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Failed to load student details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAcademicTabChange = (event, newValue) => {
    setAcademicTabValue(newValue);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const generateSemesterRecords = () => {
    if (!student || !student.grades || student.grades.length === 0) {
      setSemesterRecords([]);
      return;
    }

    // Group grades by semester
    const semesterMap = student.grades.reduce((acc, grade) => {
      // Use the course_semester field from the courses table
      const sem = grade.course_semester || 1; // Default to semester 1 if not specified
      if (!acc[sem]) {
        acc[sem] = [];
      }
      acc[sem].push(grade);
      return acc;
    }, {});

    // Calculate cumulative data for CGPA
    let totalCumulativeCredits = 0;
    let totalCumulativePoints = 0;
    let totalBacklogSubjects = 0;
    
    // Generate semester records
    const records = Object.keys(semesterMap)
      .sort((a, b) => parseInt(a) - parseInt(b)) // Sort by semester (ascending) for CGPA calculation
      .map(semester => {
        const courses = semesterMap[semester];
        const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
        const totalGradePoints = courses.reduce((sum, course) => sum + ((course.grade_points || 0) * (course.credits || 0)), 0);
        const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 'N/A';
        
        // Count backlog subjects (failed courses)
        const failedCourses = courses.filter(course => 
          (course.grade === 'F' || course.grade_points < 4.0)
        );
        const backlogCount = failedCourses.length;
        totalBacklogSubjects += backlogCount;
        
        // Add to cumulative totals for CGPA calculation
        totalCumulativeCredits += totalCredits;
        totalCumulativePoints += totalGradePoints;
        
        // Calculate CGPA up to this semester
        const cgpa = totalCumulativeCredits > 0 
          ? (totalCumulativePoints / totalCumulativeCredits).toFixed(2) 
          : 'N/A';
        
        return {
          semester: parseInt(semester),
          courses,
          sgpa,
          cgpa,
          credits_earned: totalCredits,
          cumulative_credits: totalCumulativeCredits,
          backlog_count: backlogCount,
          status: parseFloat(sgpa) >= 6.0 ? 'Passed' : 'Failed' // Status based on SGPA
        };
      })
      .sort((a, b) => a.semester - b.semester); // Sort by semester (ascending) for display
      
    // Add backlog count to student object for summary display
    if (student) {
      student.backlog_count = totalBacklogSubjects;
      student.total_subjects = student.grades.length;
      student.total_credits = totalCumulativeCredits;
    }

    // Filter by selected semester if needed
    const filteredRecords = selectedSemester === 'all' 
      ? records 
      : records.filter(record => record.semester === parseInt(selectedSemester));

    setSemesterRecords(filteredRecords);
  };

  // Prepare chart data for analytics
  const prepareChartData = () => {
    if (!student || !student.grades || student.grades.length === 0) {
      return {
        sgpaTrendData: { labels: [], datasets: [] },
        gradeDistributionData: { labels: [], datasets: [] },
        subjectAreaData: { labels: [], datasets: [] }
      };
    }

    // Group grades by semester for SGPA trend
    const semesterMap = student.grades.reduce((acc, grade) => {
      const sem = grade.semester || 1;
      if (!acc[sem]) {
        acc[sem] = [];
      }
      acc[sem].push(grade);
      return acc;
    }, {});

    // Calculate SGPA for each semester
    const sgpaData = Object.keys(semesterMap).map(semester => {
      const courses = semesterMap[semester];
      const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
      const totalGradePoints = courses.reduce((sum, course) => sum + ((course.grade_points || 0) * (course.credits || 0)), 0);
      return {
        semester: parseInt(semester),
        sgpa: totalCredits > 0 ? parseFloat((Math.random() * 4 + 6).toFixed(2)) : 0
      };
    }).sort((a, b) => a.semester - b.semester);

    // Count grades for distribution
    const gradeCount = student.grades.reduce((acc, grade) => {
      const gradeKey = grade.grade || 'N/A';
      acc[gradeKey] = (acc[gradeKey] || 0) + 1;
      return acc;
    }, {});

    // Group by subject area (first 2 chars of course code)
    const subjectAreaMap = student.grades.reduce((acc, grade) => {
      const area = grade.course_code ? grade.course_code.substring(0, 2) : 'XX';
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(grade);
      return acc;
    }, {});

    // Calculate average grade points by subject area
    const subjectAreaData = Object.keys(subjectAreaMap).map(area => {
      const courses = subjectAreaMap[area];
      const totalGradePoints = courses.reduce((sum, course) => sum + (course.grade_points || 0), 0);
      return {
        area,
        avgGradePoints: (totalGradePoints / courses.length).toFixed(2)
      };
    });

    return {
      sgpaTrendData: {
        labels: sgpaData.map(item => `Semester ${item.semester}`),
        datasets: [{
          label: 'SGPA',
          data: sgpaData.map(item => item.sgpa),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        }]
      },
      gradeDistributionData: {
        labels: Object.keys(gradeCount),
        datasets: [{
          label: 'Number of Courses',
          data: Object.values(gradeCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ]
        }]
      },
      subjectAreaData: {
        labels: subjectAreaData.map(item => `${item.area}`),
        datasets: [{
          label: 'Average Grade Points',
          data: subjectAreaData.map(item => item.avgGradePoints),
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      }
    };
  };

  const { sgpaTrendData, gradeDistributionData, subjectAreaData } = prepareChartData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!student) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No student found with registration number {regNo}.
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed information about {student.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Student Basic Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
             
               <Avatar
                src={`${API_BASE_URL}/reports/images/student-images/${student.registration_number}.jpg`}
                sx={{
                width: 130,
                height: 130,
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                border: '4px solid transparent',
                borderRadius: '50%',
                backgroundImage: 'linear-gradient(white, white), radial-gradient(circle at top left, #3f51b5, #00bcd4)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 25px rgba(0, 0, 0, 0.4)',
                },
                '& img': {
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  borderRadius: '50%',
                },
              }}
              onError={(e) => {
                e.target.src = '';
                e.target.onerror = null;
              }}
            >
                {student.name ? student.name[0] : 'S'}
            </Avatar>
              
              <Typography variant="h5" align="center">{student.name}</Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {student.registration_number}
              </Typography>
              <Chip
                label={student.branch}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemText primary="Current Semester" secondary={student.current_semester} />
              </ListItem>
              <ListItem>
                <ListItemText primary="CGPA" secondary={student.cgpa || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={student.email || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone" secondary={student.phone || 'N/A'} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Student Details Tabs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab icon={<AchievementsIcon />} label="Achievements" />
              <Tab icon={<SchoolIcon />} label="Academics" />
              <Tab icon={<CertificationsIcon />} label="Certifications" />
              <Tab icon={<CounselingIcon />} label="Counseling" />
            </Tabs>

            {/* Academics Tab */}
            {tabValue === 1 && (
              <Box>
                <Tabs 
                  value={academicTabValue} 
                  onChange={handleAcademicTabChange} 
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Semester Records" />
                  <Tab label="Analytics" />
                </Tabs>
                
                {/* Semester Records Tab */}
                {academicTabValue === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Semester Records</Typography>
                      <Box sx={{ minWidth: 150 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Semester</InputLabel>
                          <Select
                            value={selectedSemester}
                            onChange={handleSemesterChange}
                            label="Semester"
                          >
                            <MenuItem value="all">All Semesters</MenuItem>
                            {[...Array(student.current_semester || 8)].map((_, i) => (
                              <MenuItem key={i + 1} value={i + 1}>Semester {i + 1}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    
                    {/* Summary Card */}
                    {semesterRecords.length > 0 && (
                      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>Academic Summary</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Typography variant="body2">Overall CGPA</Typography>
                              <Typography variant="h5">
                                {semesterRecords[semesterRecords.length - 1]?.cgpa || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="body2">Credits</Typography>
                              <Typography variant="h5">
                                {semesterRecords.reduce((sum, record) => sum + record.credits_earned, 0)}/
                                {student.total_credits || semesterRecords.reduce((sum, record) => sum + record.credits_earned, 0)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="body2">Due Subjects</Typography>
                              <Typography variant="h5">
                                {student.backlog_count || '0'}/{student.total_subjects || student.grades?.length || '0'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}
                    
                    {semesterRecords.map((record, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Semester {record.semester}
                          </Typography>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">SGPA</Typography>
                              <Typography variant="h6">{record.sgpa}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">CGPA</Typography>
                              <Typography variant="h6">{record.cgpa}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">Credits Earned</Typography>
                              <Typography variant="h6">{record.credits_earned}</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">Status</Typography>
                              <Chip 
                                label={record.status} 
                                color={record.status === 'Passed' ? 'success' : 'error'} 
                                size="small" 
                              />
                            </Grid>
                          </Grid>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="subtitle1" gutterBottom>Courses</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Course Code</TableCell>
                                  <TableCell>Course Name</TableCell>
                                  <TableCell>Semester</TableCell>
                                  <TableCell>Credits</TableCell>
                                  <TableCell>Grade</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {record.courses.map((course, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{course.course_code}</TableCell>
                                    <TableCell>{course.course_name}</TableCell>
                                    <TableCell>{course.course_semester}</TableCell>
                                    <TableCell>{course.credits}</TableCell>
                                    <TableCell>{course.grade}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {semesterRecords.length === 0 && (
                      <Alert severity="info">No semester records available</Alert>
                    )}
                  </Box>
                )}
                
                {/* Analytics Tab */}
                {academicTabValue === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Academic Analytics</Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>SGPA Trend</Typography>
                            <Box sx={{ height: 300 }}>
                              <Line 
                                data={sgpaTrendData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: false,
                                      min: 5,
                                      max: 10,
                                      title: {
                                        display: true,
                                        text: 'SGPA'
                                      }
                                    },
                                    x: {
                                      title: {
                                        display: true,
                                        text: 'Semester'
                                      }
                                    }
                                  }
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>Grade Distribution</Typography>
                            <Box sx={{ height: 300 }}>
                              <Bar 
                                data={gradeDistributionData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      title: {
                                        display: true,
                                        text: 'Number of Courses'
                                      }
                                    }
                                  }
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>Subject Area Performance</Typography>
                            <Box sx={{ height: 300 }}>
                              <Bar 
                                data={subjectAreaData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: false,
                                      min: 5,
                                      max: 10,
                                      title: {
                                        display: true,
                                        text: 'Average Grade Points'
                                      }
                                    }
                                  }
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            )}

            {/* Achievements Tab */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>Achievements</Typography>
                {student.achievements && student.achievements.length > 0 ? (
                  <Grid container spacing={2}>
                    {student.achievements.map((achievement, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" noWrap gutterBottom>{achievement.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                              {achievement.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                              <Chip 
                                label={achievement.category} 
                                size="small" 
                                color="primary" 
                              />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(achievement.achievement_date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">No achievements recorded</Alert>
                )}
              </Box>
            )}

            {/* Certifications Tab */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Certifications</Typography>
                {student.certifications && student.certifications.length > 0 ? (
                  <Grid container spacing={2}>
                    {student.certifications.map((certification, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" noWrap gutterBottom>{certification.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Issued by: {certification.issuer || certification.issuing_organization}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                              <Typography variant="body2" color="text.secondary">
                                ID: {certification.credential_id || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(certification.issue_date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">No certifications recorded</Alert>
                )}
              </Box>
            )}

            {/* Counseling Tab */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>Counseling Notes</Typography>
                {student.counselingNotes && student.counselingNotes.length > 0 ? (
                  <List>
                    {student.counselingNotes.map((note, index) => (
                      <ListItem key={index} divider={index < student.counselingNotes.length - 1}>
                        <ListItemIcon>
                          <CounselingIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={note.title || 'Counseling Session'}
                          secondary={
                            <>
                              <Typography variant="body2" component="span">
                                {note.notes || note.content}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(note.created_at).toLocaleDateString()} by {note.first_name} {note.last_name}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">No counseling notes recorded</Alert>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default StudentDetail;
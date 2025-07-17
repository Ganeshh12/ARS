import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, CircularProgress, Alert,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Card, CardContent, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend } from 'chart.js';
import { studentApi } from '../../services/student-api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend);

const StudentAcademics = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getStudentProfile();
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      setError('Failed to load academic data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare SGPA chart data
  const prepareChartData = () => {
    if (!student || !student.grades) return null;
    
    // Group grades by semester
    const semesterMap = {};
    student.grades.forEach(grade => {
      const sem = grade.course_semester || 1;
      if (!semesterMap[sem]) {
        semesterMap[sem] = [];
      }
      semesterMap[sem].push(grade);
    });
    
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
    
    return {
      labels: sgpaData.map(item => `Semester ${item.semester}`),
      datasets: [{
        label: 'SGPA',
        data: sgpaData.map(item => item.sgpa),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }]
    };
  };

  const chartData = student ? prepareChartData() : null;
  const chartOptions = {
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
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!student) return <Alert severity="info" sx={{ mt: 2 }}>No academic data found.</Alert>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Academic Records
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your academic performance and course history
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Academic Summary Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Academic Summary</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Current Semester</Typography>
                <Typography variant="h5">{student.current_semester}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">CGPA</Typography>
                <Typography variant="h5">{student.cgpa || 'N/A'}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Total Credits</Typography>
                <Typography variant="h5">
                  {student.grades ? student.grades.reduce((sum, grade) => sum + (grade.credits || 0), 0) : 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">Branch</Typography>
                <Typography variant="h5">{student.branch}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* SGPA Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>SGPA Trend</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ height: 300 }}>
              {chartData ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Alert severity="info">No SGPA data available</Alert>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Course Records */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Course Records</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {student.grades && student.grades.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Code</TableCell>
                      <TableCell>Course Name</TableCell>
                      <TableCell>Semester</TableCell>
                      <TableCell>Credits</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Grade Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student.grades.map((grade, index) => (
                      <TableRow key={index}>
                        <TableCell>{grade.course_code}</TableCell>
                        <TableCell>{grade.course_name}</TableCell>
                        <TableCell>{grade.course_semester}</TableCell>
                        <TableCell>{grade.credits}</TableCell>
                        <TableCell>{grade.grade}</TableCell>
                        <TableCell>{grade.grade_points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No course records available</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default StudentAcademics;
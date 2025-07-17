import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
  Alert, Divider, Paper, Avatar, List, ListItem, ListItemText,
  Chip, Tabs, Tab
} from '@mui/material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Event as EventIcon, Group as GroupIcon } from '@mui/icons-material';
import { studentApi } from '../../services/student-api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentDashboard = () => {
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState({
    student: {},
    stats: { totalCredits: 0, completedCredits: 0, achievements: 0, certifications: 0 },
    recentActivities: [],
    performanceData: [],
    upcomingEvents: [],
    classmates: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Determine page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/achievements')) {
      return 'Student Achievements';
    } else if (path.includes('/certifications')) {
      return 'Student Certifications';
    } else {
      return 'Student Details';
    }
  };

  // Determine active tab based on route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/achievements')) {
      return 2; // Show achievements tab
    } else if (path.includes('/certifications')) {
      return 1; // Show certifications tab
    } else {
      return 0; // Show details tab
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Set tab value based on route
    setTabValue(getActiveTab());
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Prepare performance chart data
  const performanceChartData = {
    labels: dashboardData.performanceData?.map(item => item.semester) || [],
    datasets: [{
      label: 'SGPA',
      data: dashboardData.performanceData?.map(item => item.sgpa) || [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1
    }]
  };



  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {getPageTitle()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {dashboardData.student?.name?.split(' ')[0] || 'Student'}. Here's an overview of your academic information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Student Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={`${API_BASE_URL}/reports/images/student-images/${dashboardData.student?.registration_number}.jpg`}
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
                  {dashboardData.student?.name ? dashboardData.student.name[0] : 'S'}
                </Avatar>

              <Typography variant="h5" align="center">{dashboardData.student?.name}</Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {dashboardData.student?.registration_number}
              </Typography>
              <Chip label={dashboardData.student?.branch} color="primary" sx={{ mt: 1 }} />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemText primary="Current Semester" secondary={dashboardData.student?.current_semester} />
              </ListItem>
              <ListItem>
                <ListItemText primary="CGPA" secondary={dashboardData.student?.cgpa || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={dashboardData.student?.email || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone" secondary={dashboardData.student?.phone || 'N/A'} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Academic Progress" />
              <Tab label="Certifications" />
              <Tab label="Achievements" />
            </Tabs>

            {/* Academic Progress Tab */}
            {tabValue === 0 && (
              <>
                <Typography variant="h6" gutterBottom>Academic Progress</Typography>
                
                {/* Stats Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Total Credits</Typography>
                        <Typography variant="h5">{dashboardData.stats?.totalCredits}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Completed</Typography>
                        <Typography variant="h5">{dashboardData.stats?.completedCredits}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Achievements</Typography>
                        <Typography variant="h5">{dashboardData.stats?.achievements}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Certifications</Typography>
                        <Typography variant="h5">{dashboardData.stats?.certifications}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                {/* Performance Chart */}
                <Box sx={{ height: 300, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>SGPA Trend</Typography>
                  <Line data={performanceChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: false, min: 5, max: 10 }
                    }
                  }} />
                </Box>
              </>
            )}

            {/* Certifications Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>Certifications</Typography>
                {dashboardData.student?.certifications && dashboardData.student.certifications.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.student.certifications.map((certification, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6">{certification.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Issued by: {certification.issuer || certification.issuing_organization}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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

            {/* Achievements Tab */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Achievements</Typography>
                {dashboardData.student?.achievements && dashboardData.student.achievements.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.student.achievements.map((achievement, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6">{achievement.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {achievement.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Chip label={achievement.category} size="small" color="primary" />
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
          </Paper>
        </Grid>

        {/* Activities and Classmates Section */}
        {tabValue === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Tabs value={0} sx={{ mb: 3 }}>
                <Tab icon={<EventIcon />} label="Recent Activities" />
              </Tabs>

              <Box>
                <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                {dashboardData.recentActivities?.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.recentActivities.map((activity, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                              {new Date(activity.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {activity.title}
                            </Typography>
                            <Typography variant="body2">
                              {activity.course || activity.category}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">No recent activities found</Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
};

export default StudentDashboard;
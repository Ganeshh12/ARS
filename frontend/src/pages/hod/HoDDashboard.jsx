import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../../services/api_enhanced';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Charts
import PerformanceChart from '../../components/charts/PerformanceChart';
import BranchDistributionChart from '../../components/charts/BranchDistributionChart';

const HoDDashboard = () => {
  const [departmentStats, setDepartmentStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    totalCourses: 0,
    achievements: 0,
    avgPerformance: 0,
    passRate: 0
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock department stats
        setDepartmentStats({
          totalFaculty: 24,
          totalStudents: 480,
          totalCourses: 32,
          achievements: 156,
          avgPerformance: 8.4,
          passRate: 92
        });
        
        // Mock performance data
        setPerformanceData([
          { semester: 'Sem 1', avgSGPA: 8.2 },
          { semester: 'Sem 2', avgSGPA: 8.5 },
          { semester: 'Sem 3', avgSGPA: 8.3 },
          { semester: 'Sem 4', avgSGPA: 8.7 },
          { semester: 'Sem 5', avgSGPA: 8.6 },
          { semester: 'Sem 6', avgSGPA: 8.9 }
        ]);
        
        // Mock branch data
        setBranchData([
          { branch: 'CSE-AIML', count: 120 },
          { branch: 'CSE-DS', count: 85 },
          { branch: 'CSE-Core', count: 150 },
          { branch: 'CSE-IoT', count: 65 },
          { branch: 'CSE-Cyber', count: 60 }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Department Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of Computer Science Department performance and metrics
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Faculty Members
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                {departmentStats.totalFaculty}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                In the department
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Students
              </Typography>
              <Typography variant="h3" component="div" color="info.main">
                {departmentStats.totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Currently enrolled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Courses
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                {departmentStats.totalCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Active this semester
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Department Performance Trends
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <PerformanceChart data={performanceData} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Specialization Distribution
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BranchDistributionChart data={branchData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Key Performance Indicators
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Average CGPA" 
                  secondary={`${departmentStats.avgPerformance} / 10.0`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Pass Rate" 
                  secondary={`${departmentStats.passRate}%`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmojiEventsIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Student Achievements" 
                  secondary={departmentStats.achievements} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Department Highlights
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Research Publications" 
                  secondary="12 papers published in the last semester" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PeopleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Industry Collaborations" 
                  secondary="5 new partnerships established" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Placement Rate" 
                  secondary="94% of eligible students placed" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default HoDDashboard;
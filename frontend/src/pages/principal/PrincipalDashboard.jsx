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
  ListItemIcon,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../../services/api_enhanced';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';

// Charts
import PerformanceChart from '../../components/charts/PerformanceChart';
import BranchDistributionChart from '../../components/charts/BranchDistributionChart';

const PrincipalDashboard = () => {
  const [institutionStats, setInstitutionStats] = useState({
    totalDepartments: 0,
    totalFaculty: 0,
    totalStudents: 0,
    avgPerformance: 0,
    placementRate: 0,
    researchPublications: 0
  });
  const [departmentPerformance, setDepartmentPerformance] = useState([]);
  const [studentDistribution, setStudentDistribution] = useState([]);
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
        
        // Mock institution stats
        setInstitutionStats({
          totalDepartments: 6,
          totalFaculty: 120,
          totalStudents: 2400,
          avgPerformance: 8.2,
          placementRate: 92,
          researchPublications: 45
        });
        
        // Mock department performance data
        setDepartmentPerformance([
          { semester: 'CSE', avgSGPA: 8.7 },
          { semester: 'ECE', avgSGPA: 8.4 },
          { semester: 'IT', avgSGPA: 8.5 },
          { semester: 'MECH', avgSGPA: 8.1 },
          { semester: 'CIVIL', avgSGPA: 8.0 },
          { semester: 'EEE', avgSGPA: 8.3 }
        ]);
        
        // Mock student distribution data
        setStudentDistribution([
          { branch: 'CSE', count: 600 },
          { branch: 'ECE', count: 480 },
          { branch: 'IT', count: 420 },
          { branch: 'MECH', count: 360 },
          { branch: 'CIVIL', count: 300 },
          { branch: 'EEE', count: 240 }
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
          Institution Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive overview of the institution's performance and metrics
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Departments
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                {institutionStats.totalDepartments}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Academic departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Faculty
              </Typography>
              <Typography variant="h3" component="div" color="info.main">
                {institutionStats.totalFaculty}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Teaching staff
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
              <Typography variant="h3" component="div" color="success.main">
                {institutionStats.totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Currently enrolled
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
              Department Performance Comparison
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <PerformanceChart data={departmentPerformance} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Student Distribution
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BranchDistributionChart data={studentDistribution} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Institution Highlights
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Average CGPA" 
                  secondary={`${institutionStats.avgPerformance} / 10.0`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Placement Rate" 
                  secondary={`${institutionStats.placementRate}%`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Research Publications" 
                  secondary={institutionStats.researchPublications} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Departments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <StarIcon sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Computer Science Engineering" 
                  secondary="Average CGPA: 8.7" 
                />
                <Chip label="1st" color="primary" size="small" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StarIcon sx={{ color: '#C0C0C0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Information Technology" 
                  secondary="Average CGPA: 8.5" 
                />
                <Chip label="2nd" color="primary" size="small" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StarIcon sx={{ color: '#CD7F32' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Electronics & Communication" 
                  secondary="Average CGPA: 8.4" 
                />
                <Chip label="3rd" color="primary" size="small" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PrincipalDashboard;
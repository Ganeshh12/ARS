import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 4,
    activeUsers: 4,
    totalStudents: 120,
    totalFaculty: 15
  });
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          System administration and management
        </Typography>
      </Box>

      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.totalUsers}
                    </Typography>
                    <Typography variant="body2">
                      Total Users
                    </Typography>
                  </Box>
                  <PeopleIcon fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.activeUsers}
                    </Typography>
                    <Typography variant="body2">
                      Active Users
                    </Typography>
                  </Box>
                  <AdminPanelSettingsIcon fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.totalStudents}
                    </Typography>
                    <Typography variant="body2">
                      Total Students
                    </Typography>
                  </Box>
                  <PeopleIcon fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.totalFaculty}
                    </Typography>
                    <Typography variant="body2">
                      Total Faculty
                    </Typography>
                  </Box>
                  <PeopleIcon fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/admin/users')}
                    sx={{ mb: 2 }}
                  >
                    Manage Users
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<SecurityIcon />}
                    onClick={() => navigate('/admin/settings')}
                    sx={{ mb: 2 }}
                  >
                    System Settings
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<StorageIcon />}
                    sx={{ mb: 2 }}
                  >
                    Database Backup
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{ mb: 2 }}
                  >
                    Access Control
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Alert severity="success">
                  All systems operational
                </Alert>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Last Backup:</strong> {new Date().toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Server Status:</strong> Online
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Database Status:</strong> Connected
                </Typography>
                <Typography variant="body2">
                  <strong>System Version:</strong> 1.0.0
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
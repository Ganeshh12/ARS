import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import ViewFilter from '../../../components/common/ViewFilter.jsx';
import StatCards from '../../../components/FacultyDashboard/StatCards';
import StudentPerformanceTrends from '../../../components/FacultyDashboard/StudentPerformanceTrends';
import BranchDistribution from '../../../components/FacultyDashboard/BranchDistribution';
import TopPerformingStudents from '../../../components/FacultyDashboard/TopPerformingStudents';
import RecentActivities from '../../../components/FacultyDashboard/RecentActivities';

import axios from 'axios';
import { useStudentFilter } from '../../../contexts/StudentFilterContext.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = import.meta.env.VITE_API_BASE_URL;

const FacultyDashboard = () => {
  const { studentFilter } = useStudentFilter(); // 👈 Use context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      avgCGPA: 0,
      achievements: 0,
      certifications: 0
    },
    topStudents: [],
    recentActivities: [],
    performanceData: [],
    branchDistribution: []
  });

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { username: 'faculty' };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/faculty/dashboard`, {
        params: {
          filter: studentFilter,
          username: user.username
        }
      });

      setDashboardData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [studentFilter]); // 👈 Watch context filter

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
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Faculty Dashboard
          </Typography>

          <ViewFilter />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCards dashboardData={dashboardData.stats} itemVariants={itemVariants} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <StudentPerformanceTrends itemVariants={itemVariants} dashboardData={dashboardData} />
                <BranchDistribution itemVariants={itemVariants} dashboardData={dashboardData} />
              </Grid>

              <Grid item xs={12} md={4}>
                <TopPerformingStudents itemVariants={itemVariants} dashboardData={dashboardData} />
                <RecentActivities itemVariants={itemVariants} dashboardData={dashboardData} />
              </Grid>
            </Grid>
          </motion.div>
        )}
      </motion.div>
    </Box>
  );
};

export default FacultyDashboard;

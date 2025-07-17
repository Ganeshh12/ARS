import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { achievementsApi } from '../../services/achievements-api';
import AchievementFilterBar from '../../components/AchievementFilterBar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AchievementStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    timeRange: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    totalCount: 0,
    categoryDistribution: {},
    scopeDistribution: {},
    monthlyTrends: {}
  });

  // Load achievements data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await achievementsApi.getAllAchievements();
        setAchievements(data);
        processStats(data);
      } catch (err) {
        setError('Failed to load achievement data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for stats when achievements or filters change
  useEffect(() => {
    processStats(achievements);
  }, [achievements, filters]);

  // Process achievements data into statistics
  const processStats = (data) => {
    if (!data || data.length === 0) return;

    // Filter data based on filters
    let filteredData = [...data];
    
    if (filters.category) {
      filteredData = filteredData.filter(item => item.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        (item.student_name && item.student_name.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (filters.timeRange === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (filters.timeRange === 'quarter') {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (filters.timeRange === 'year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filteredData = filteredData.filter(item => {
        if (!item.achievement_date) return false;
        const achievementDate = new Date(item.achievement_date.split('/').reverse().join('-'));
        return achievementDate >= cutoffDate;
      });
    }

    // Calculate statistics
    const categoryDistribution = {};
    const scopeDistribution = {};
    const monthlyTrends = {};

    filteredData.forEach(item => {
      // Category distribution
      const category = item.category || 'Uncategorized';
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
      
      // Scope distribution
      const scope = item.scope || 'Inside the College';
      scopeDistribution[scope] = (scopeDistribution[scope] || 0) + 1;
      
      // Monthly trends
      if (item.achievement_date) {
        const date = new Date(item.achievement_date.split('/').reverse().join('-'));
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        monthlyTrends[monthYear] = (monthlyTrends[monthYear] || 0) + 1;
      }
    });

    setStats({
      totalCount: filteredData.length,
      categoryDistribution,
      scopeDistribution,
      monthlyTrends
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Prepare chart data
  const categoryChartData = {
    labels: Object.keys(stats.categoryDistribution),
    datasets: [
      {
        label: 'Achievements by Category',
        data: Object.values(stats.categoryDistribution),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const scopeChartData = {
    labels: Object.keys(stats.scopeDistribution),
    datasets: [
      {
        label: 'Achievements by Scope',
        data: Object.values(stats.scopeDistribution),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sort months chronologically
  const sortedMonths = Object.keys(stats.monthlyTrends).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  const trendsChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Achievements by Month',
        data: sortedMonths.map(month => stats.monthlyTrends[month]),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Achievement Statistics</Typography>
      
      <AchievementFilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Achievement Statistics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Total Achievements</Typography>
                    <Typography variant="h3">{stats.totalCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Outside College</Typography>
                    <Typography variant="h3">
                      {stats.scopeDistribution['Outside the College'] || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>This Month</Typography>
                    <Typography variant="h3">
                      {(() => {
                        const now = new Date();
                        const monthYear = `${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
                        return stats.monthlyTrends[monthYear] || 0;
                      })()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Top Category</Typography>
                    <Typography variant="h3">
                      {(() => {
                        const categories = Object.entries(stats.categoryDistribution);
                        if (categories.length === 0) return 'N/A';
                        return categories.sort((a, b) => b[1] - a[1])[0][0];
                      })()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Achievements by Category</Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Achievements by Scope</Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={scopeChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Achievement Trends</Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={trendsChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AchievementStats;
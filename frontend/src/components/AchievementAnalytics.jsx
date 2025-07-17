import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { achievementsApi } from '../services/achievements-api';

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

const AchievementAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [chartData, setChartData] = useState({
    categoryData: {
      labels: [],
      datasets: []
    },
    monthlyData: {
      labels: [],
      datasets: []
    },
    scopeData: {
      labels: [],
      datasets: []
    }
  });

  // Load achievements data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await achievementsApi.getAllAchievements();
        setAchievements(data);
        processChartData(data);
      } catch (err) {
        setError('Failed to load achievement data for analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for charts when achievements or time range changes
  useEffect(() => {
    processChartData(achievements);
  }, [achievements, timeRange]);

  // Process data for various charts
  const processChartData = (data) => {
    if (!data || data.length === 0) return;

    // Filter data based on time range
    let filteredData = [...data];
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (timeRange === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeRange === 'quarter') {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (timeRange === 'year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filteredData = data.filter(item => {
        const achievementDate = new Date(item.achievement_date);
        return achievementDate >= cutoffDate;
      });
    }

    // Process category data
    const categories = {};
    filteredData.forEach(item => {
      const category = item.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });

    // Process scope data
    const scopes = {};
    filteredData.forEach(item => {
      const scope = item.scope || 'Inside the College';
      scopes[scope] = (scopes[scope] || 0) + 1;
    });

    // Process monthly data
    const months = {};
    filteredData.forEach(item => {
      if (item.achievement_date) {
        const date = new Date(item.achievement_date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        months[monthYear] = (months[monthYear] || 0) + 1;
      }
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(months).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    // Update chart data
    setChartData({
      categoryData: {
        labels: Object.keys(categories),
        datasets: [
          {
            label: 'Achievements by Category',
            data: Object.values(categories),
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
      },
      monthlyData: {
        labels: sortedMonths,
        datasets: [
          {
            label: 'Achievements by Month',
            data: sortedMonths.map(month => months[month]),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.4,
          },
        ],
      },
      scopeData: {
        labels: Object.keys(scopes),
        datasets: [
          {
            label: 'Achievements by Scope',
            data: Object.values(scopes),
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
      }
    });
  };

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Achievement Analytics</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Achievements by Category</Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={chartData.categoryData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Achievements by Scope</Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={chartData.scopeData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Achievement Trends</Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={chartData.monthlyData} 
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
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Achievement Statistics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Total Achievements</Typography>
                    <Typography variant="h3">{achievements.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Outside College</Typography>
                    <Typography variant="h3">
                      {achievements.filter(a => a.scope === 'Outside the College').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>This Month</Typography>
                    <Typography variant="h3">
                      {achievements.filter(a => {
                        if (!a.achievement_date) return false;
                        const date = new Date(a.achievement_date);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && 
                               date.getFullYear() === now.getFullYear();
                      }).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Verified</Typography>
                    <Typography variant="h3">
                      {achievements.filter(a => a.verified).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AchievementAnalytics;
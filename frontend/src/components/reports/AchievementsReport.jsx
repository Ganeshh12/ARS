import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AchievementsReport = ({ data }) => {
  if (!data) return null;
  
  const {
    student,
    achievements,
    statistics
  } = data;
  
  // Prepare chart data for achievement categories
  const categoryData = {
    labels: statistics.categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Number of Achievements',
        data: statistics.categories.map(cat => cat.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare chart data for achievement scope
  const scopeData = {
    labels: statistics.scopes.map(scope => scope.name),
    datasets: [
      {
        label: 'Number of Achievements',
        data: statistics.scopes.map(scope => scope.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Achievement Categories'
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Achievement Scope'
      }
    }
  };
  
  // Get color for category
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'academic':
        return 'primary';
      case 'technical':
        return 'success';
      case 'sports':
        return 'warning';
      case 'cultural':
        return 'secondary';
      case 'community service':
        return 'info';
      default:
        return 'default';
    }
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Student Achievements Report
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Student:</strong> {student.name} ({student.registration_number})
              </Typography>
              <Typography variant="subtitle1">
                <strong>Branch:</strong> {student.branch}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Total Achievements:</strong> {achievements.length}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Achievement Points:</strong> {statistics.total_points}
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Achievement Categories
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Bar data={categoryData} options={chartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Achievement Scope
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Doughnut data={scopeData} options={doughnutOptions} />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Achievement Details
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {achievements.map((achievement, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {achievement.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={achievement.category} 
                        size="small" 
                        color={getCategoryColor(achievement.category)}
                      />
                    </TableCell>
                    <TableCell>{achievement.scope}</TableCell>
                    <TableCell>{new Date(achievement.achievement_date).toLocaleDateString()}</TableCell>
                    <TableCell>{achievement.points || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {achievements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No achievements found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {statistics.recommendations && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              
              <Box sx={{ pl: 2 }}>
                {statistics.recommendations.map((recommendation, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {recommendation}
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AchievementsReport;
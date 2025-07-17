import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

function StudentPerformanceTrends({ itemVariants, dashboardData }) {
  const performanceChartData = {
    labels: dashboardData.performanceData.map(item => item.semester),
    datasets: [
      {
        label: 'Average SGPA',
        data: dashboardData.performanceData.map(item => item.avgSGPA),
        backgroundColor: 'rgba(69, 104, 220, 0.8)',
        borderColor: 'rgba(69, 104, 220, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <motion.div variants={itemVariants}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Student Performance Trends
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '2 / 1.05' }}>
  <Bar 
    data={performanceChartData}
    options={{
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: false,
          min: 4,
          max: 10,
          ticks: {
            stepSize: 0.5
          }
        }
      }
    }}
  />
</Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// StudentPerformanceTrends.propTypes = {
//   itemVariants: PropTypes.object.isRequired,
//   dashboardData: PropTypes.shape({
//     performanceData: PropTypes.arrayOf(
//       PropTypes.shape({
//         semester: PropTypes.string.isRequired,
//         avgSGPA: PropTypes.number.isRequired
//       })
//     ).isRequired
//   }).isRequired
// };

export default StudentPerformanceTrends;

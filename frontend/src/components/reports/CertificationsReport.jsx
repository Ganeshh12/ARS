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
  Divider,
  Link
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

const CertificationsReport = ({ data }) => {
  if (!data) return null;
  
  const {
    student,
    certifications,
    statistics
  } = data;
  
  // Prepare chart data for certification types
  const typeData = {
    labels: statistics.types.map(type => type.name),
    datasets: [
      {
        label: 'Number of Certifications',
        data: statistics.types.map(type => type.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare chart data for certification organizations
  const orgData = {
    labels: statistics.organizations.map(org => org.name),
    datasets: [
      {
        label: 'Number of Certifications',
        data: statistics.organizations.map(org => org.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
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
        text: 'Certification Types'
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
        text: 'Certification Organizations'
      }
    }
  };
  
  // Get color for certification type
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'technical':
        return 'primary';
      case 'professional':
        return 'success';
      case 'academic':
        return 'info';
      case 'soft skills':
        return 'secondary';
      case 'language':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Get verification status color
  const getVerificationColor = (verified) => {
    return verified ? 'success' : 'warning';
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Student Certifications Report
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
                <strong>Total Certifications:</strong> {certifications.length}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Verified Certifications:</strong> {statistics.verified_count} ({Math.round((statistics.verified_count / certifications.length) * 100)}%)
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Certification Types
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Bar data={typeData} options={chartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Certification Organizations
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Doughnut data={orgData} options={doughnutOptions} />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Certification Details
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certifications.map((certification, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {certification.title}
                      </Typography>
                      {certification.credential_id && (
                        <Typography variant="caption" color="text.secondary">
                          ID: {certification.credential_id}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={certification.certification_type} 
                        size="small" 
                        color={getTypeColor(certification.certification_type)}
                      />
                    </TableCell>
                    <TableCell>{certification.issuing_organization}</TableCell>
                    <TableCell>{new Date(certification.issue_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {certification.expiry_date ? 
                        new Date(certification.expiry_date).toLocaleDateString() : 
                        'No Expiry'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={certification.verified ? 'Verified' : 'Pending'} 
                        size="small" 
                        color={getVerificationColor(certification.verified)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {certifications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No certifications found
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

export default CertificationsReport;
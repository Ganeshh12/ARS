import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

const CertificationStatistics = ({ certifications }) => {
  const chartStyle = { height: 300 };

  const typesData = {
    labels: ['Technical', 'Language', 'Professional', 'Soft Skills', 'Other'],
    datasets: [{
      data: [
        certifications.filter(c => c.certification_type === 'technical').length,
        certifications.filter(c => c.certification_type === 'language').length,
        certifications.filter(c => c.certification_type === 'professional').length,
        certifications.filter(c => c.certification_type === 'soft_skills').length,
        certifications.filter(c => c.certification_type === 'other' || !c.certification_type).length,
      ],
      backgroundColor: ['#4568dc', '#b06ab3', '#4caf50', '#ff9800', '#f44336'],
    }],
  };

  const statusData = {
    labels: ['Verified', 'Pending Verification'],
    datasets: [{
      data: [
        certifications.filter(c => c.verified).length,
        certifications.filter(c => !c.verified).length,
      ],
      backgroundColor: ['#4caf50', '#ff9800'],
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const renderChart = (data) =>
    certifications.length > 0 ? (
      <Doughnut data={data} options={doughnutOptions} />
    ) : (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Certification Types
            </Typography>
            <Box sx={chartStyle}>{renderChart(typesData)}</Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Verification Status
            </Typography>
            <Box sx={chartStyle}>{renderChart(statusData)}</Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CertificationStatistics;

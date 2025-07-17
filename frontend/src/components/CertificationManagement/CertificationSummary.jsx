import { Paper, Typography, Grid, Box } from '@mui/material';

const CertificationSummary = ({ counts }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Certification Summary</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4} sm={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">{counts.total}</Typography>
            <Typography variant="body2">Total</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">{counts.verified}</Typography>
            <Typography variant="body2">Verified</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">{counts.pending}</Typography>
            <Typography variant="body2">Pending</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">{counts.technical}</Typography>
            <Typography variant="body2">Technical</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="secondary.main">{counts.language}</Typography>
            <Typography variant="body2">Language</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="text.secondary">{counts.professional}</Typography>
            <Typography variant="body2">Professional</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CertificationSummary;

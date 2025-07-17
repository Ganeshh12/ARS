import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert
} from '@mui/material';

const AchievementVerification = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Achievement Verification</Typography>
      <Alert severity="info">
        Achievement verification feature is currently disabled. Please check back later.
      </Alert>
    </Paper>
  );
};

export default AchievementVerification;
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <LockIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph>
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </Typography>
          
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
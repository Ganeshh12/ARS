import React, { useState } from 'react';
import './pages.css';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../contexts/AuthContext';
import Overview from '../assets/Overview.webp';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(username, password);
      if (result.success) {
        switch (result.user.role) {
          case 'faculty':
          case 'proctor':
            navigate('/faculty/dashboard');
            break;
          case 'hod':
            navigate('/hod/dashboard');
            break;
          case 'principal':
            navigate('/principal/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/faculty/dashboard');
        }
      } else {
        setError(result.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: 'beforeChildren', staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Fixed Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }} // adjust opacity for better visibility
        exit={{ opacity: 0.3 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundImage: `url(${Overview})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 0
        }}
      />

      {/* Foreground Login Form */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              py: 4
            }}
          >
            <img
              className="aditya-logo"
              src="https://in8cdn.npfs.co/uploads/template/6102/1556/publish/images/au_logo.png?1737981139"
              alt="au_logo"
            />

            <motion.div variants={itemVariants} style={{ width: '100%' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 2,
                  backdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)'
                }}
              >
                <motion.div variants={itemVariants}>
                  <div className="login-header">
                    <div>
                      <SchoolIcon
                        sx={{ fontSize: 32, mr: 1, color: 'primary.main' }}
                      />
                    </div>
                    <h1 className="login-title">Automated Reporting System</h1>
                  </div>
                </motion.div>

                {error && (
                  <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      background:
                        'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                      '&:hover': {
                        background:
                          'linear-gradient(45deg, #3557cb 30%, #9f59a2 90%)'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </Paper>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="black">
                  © {new Date().getFullYear()} Automated Reporting System
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
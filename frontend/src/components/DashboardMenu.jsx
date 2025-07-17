import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';

const MenuCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const IconWrapper = styled(Box)(({ bgcolor }) => ({
  backgroundColor: bgcolor,
  borderRadius: '50%',
  padding: 12,
  marginBottom: 12,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const DashboardMenu = ({ onMenuItemClick }) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu/faculty');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items. Please try again later.');
        
        // Fallback to static menu items
        setMenuItems([
          { 
            title: 'Students', 
            icon: 'PeopleIcon', 
            color: '#4568dc', 
            path: '/faculty/students',
            description: 'Manage and view student details'
          },
          { 
            title: 'Achievements', 
            icon: 'EmojiEventsIcon', 
            color: '#4caf50', 
            path: '/faculty/achievements',
            description: 'Track student achievements'
          },
          { 
            title: 'Certifications', 
            icon: 'CardMembershipIcon', 
            color: '#b06ab3', 
            path: '/faculty/certifications',
            description: 'Manage student certifications'
          },
          { 
            title: 'Reports', 
            icon: 'AssessmentIcon', 
            color: '#ff9800', 
            path: '/faculty/reports',
            description: 'Generate and view reports'
          },
          { 
            title: 'Counseling', 
            icon: 'ChatIcon', 
            color: '#2196f3', 
            path: '/faculty/counseling',
            description: 'Student counseling notes'
          },
          { 
            title: 'Calendar', 
            icon: 'CalendarMonthIcon', 
            color: '#f44336', 
            path: '/faculty/calendar',
            description: 'View academic calendar'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  // Function to get the correct icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'PeopleIcon':
        return <PeopleIcon sx={{ color: '#fff' }} />;
      case 'EmojiEventsIcon':
        return <EmojiEventsIcon sx={{ color: '#fff' }} />;
      case 'CardMembershipIcon':
        return <CardMembershipIcon sx={{ color: '#fff' }} />;
      case 'AssessmentIcon':
        return <AssessmentIcon sx={{ color: '#fff' }} />;
      case 'ChatIcon':
        return <ChatIcon sx={{ color: '#fff' }} />;
      case 'CalendarMonthIcon':
        return <CalendarMonthIcon sx={{ color: '#fff' }} />;
      case 'EditIcon':
        return <EditIcon sx={{ color: '#fff' }} />;
      case 'SchoolIcon':
        return <SchoolIcon sx={{ color: '#fff' }} />;
      default:
        return <PeopleIcon sx={{ color: '#fff' }} />;
    }
  };

  const handleCardClick = (item) => {
    // If onMenuItemClick prop is provided, call it first
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    
    // Preserve the current student filter when navigating
    const currentFilter = localStorage.getItem('studentFilter') || 'proctoring';
    console.log(`Navigating to ${item.path} with preserved filter: ${currentFilter}`);
    
    // Then navigate to the path
    navigate(item.path);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Get user role from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { role: 'faculty' };
  const isAdmin = user.role === 'admin' || user.role === 'hod' || user.role === 'principal';
  
  // Filter menu items based on admin status
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || (item.adminOnly && isAdmin));
  
  return (
    <Grid container spacing={3}>
      {filteredMenuItems.map((item, index) => (
        <Grid item xs={6} sm={4} md={2} key={index}>
          <MenuCard 
            elevation={2} 
            onClick={() => handleCardClick(item)}
          >
            <IconWrapper bgcolor={item.color}>
              {getIconComponent(item.icon)}
            </IconWrapper>
            <Typography variant="subtitle1" align="center" fontWeight="medium">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {item.description}
            </Typography>
          </MenuCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardMenu;
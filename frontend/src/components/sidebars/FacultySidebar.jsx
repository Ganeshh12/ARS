import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useStudentFilter } from '../../contexts/StudentFilterContext';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

const FacultySidebar = ({ open, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleStudentFilter } = useStudentFilter();
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { first_name: 'Faculty', last_name: 'User' };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', path: '/faculty/dashboard', icon: <DashboardIcon /> },
    { text: 'Students', path: '/faculty/students', icon: <PeopleIcon /> },
    { text: 'Achievements', path: '/faculty/achievements', icon: <EmojiEventsIcon /> },
    { text: 'Certifications', path: '/faculty/certifications', icon: <CardMembershipIcon /> },
    { text: 'Reports', path: '/faculty/reports', icon: <AssessmentIcon /> },
    { text: 'Counseling Notes', path: '/faculty/counseling', icon: <ChatIcon /> },
    { text: 'Calendar', path: '/faculty/calendar', icon: <CalendarMonthIcon /> },
  ];

  const handleMenuItemClick = (path, text) => {
    // If clicking on Students menu, set filter to 'proctoring'
    if (text === 'Students') {
      toggleStudentFilter('proctoring');
    }
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  const drawer = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40
          }}
        >
          {user.first_name ? user.first_name.charAt(0) : 'F'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" noWrap>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Faculty
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => handleMenuItemClick(item.path, item.text)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(69, 104, 220, 0.1)',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'rgba(69, 104, 220, 0.2)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(69, 104, 220, 0.05)',
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onToggle}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default FacultySidebar;
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

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import ComputerIcon from '@mui/icons-material/Computer';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { AuthProvider } from './contexts/AuthContext';

const drawerWidth = 260;

// Menu items configuration by role
const menuConfigs = {
  faculty: [
    { text: 'Dashboard', path: '/faculty/dashboard', icon: <DashboardIcon /> },
    { text: 'Students', path: '/faculty/students', icon: <PeopleIcon /> },
    { text: 'Achievements', path: '/faculty/achievements', icon: <EmojiEventsIcon /> },
    { text: 'Certifications', path: '/faculty/certifications', icon: <CardMembershipIcon /> },
    { text: 'Reports', path: '/faculty/reports', icon: <AssessmentIcon /> },
    { text: 'Counseling Notes', path: '/faculty/counseling', icon: <ChatIcon /> },
    { text: 'Calendar', path: '/faculty/calendar', icon: <CalendarMonthIcon /> },
  ],
  hod: [
    { text: 'Dashboard', path: '/hod/dashboard', icon: <DashboardIcon /> },
    { text: 'Department Overview', path: '/hod/department', icon: <BusinessIcon /> },
    { text: 'Faculty Management', path: '/hod/faculty', icon: <GroupsIcon /> },
    { text: 'Course Analytics', path: '/hod/courses', icon: <BarChartIcon /> },
    { text: 'Resource Management', path: '/hod/resources', icon: <ComputerIcon /> },
    { text: 'Department Reports', path: '/hod/reports', icon: <AssessmentIcon /> },
  ],
  principal: [
    { text: 'Dashboard', path: '/principal/dashboard', icon: <DashboardIcon /> },
    { text: 'Institution Overview', path: '/principal/institution', icon: <SchoolIcon /> },
    { text: 'Department Management', path: '/principal/departments', icon: <BusinessIcon /> },
    { text: 'Faculty Overview', path: '/principal/faculty', icon: <GroupsIcon /> },
    { text: 'Strategic Planning', path: '/principal/planning', icon: <EventNoteIcon /> },
    { text: 'Institution Reports', path: '/principal/reports', icon: <AssessmentIcon /> },
  ],
  admin: [
    { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'User Management', path: '/admin/users', icon: <PeopleIcon /> },
    { text: 'System Settings', path: '/admin/settings', icon: <SettingsIcon /> },
  ]
};

const UnifiedSidebar = ({ role = 'faculty', open, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { first_name: 'User', last_name: '' };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate('/login');
  };

  // Get menu items based on role
  const menuItems = menuConfigs[role] || menuConfigs.faculty;

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            bgcolor: 'white',
            color: 'primary.main',
            fontSize: '2rem',
          }}
        >
          {user.first_name ? user.first_name[0] : 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Typography>
      </Box>

      <Divider />

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                py: 1.5,
                px: 3,
                backgroundColor: location.pathname === item.path ? 'rgba(69, 104, 220, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(69, 104, 220, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#4568dc' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: location.pathname === item.path ? '#4568dc' : 'inherit',
                    }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto' }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ py: 1.5, px: 3 }}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body2" color="error">
                  Logout
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobile && open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: open ? '4px 0 8px rgba(0, 0, 0, 0.05)' : 'none',
            transform: open ? 'translateX(0)' : 'translateX(-100%)',
            transition: theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default UnifiedSidebar;
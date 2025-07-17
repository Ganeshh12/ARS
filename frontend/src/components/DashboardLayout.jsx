import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../contexts/AuthContext';


// import useAuth from './contexts/AuthProvider';
// console.log(useAuth);
const drawerWidth = 260;

const DashboardLayout = ({ userRole }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from localStorage
  // const userString = localStorage.getItem('user');
  // const user = userString ? JSON.parse(userString) : { first_name: 'User', last_name: '', role: userRole };
  const {user,logout} = useAuth();

  useEffect(() => {
    // Close drawer on mobile by default
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    switch (userRole) {
      case 'faculty':
        return [
          { text: 'Dashboard', path: '/faculty/dashboard', icon: <DashboardIcon /> },
          { text: 'Students', path: '/faculty/students', icon: <PeopleIcon /> },
          { text: 'Achievements', path: '/faculty/achievements', icon: <EmojiEventsIcon /> },
          { text: 'Certifications', path: '/faculty/certifications', icon: <CardMembershipIcon /> },
          { text: 'Admissions', path: '/faculty/admissions', icon: <SchoolIcon /> },
          { text: 'Reports', path: '/faculty/reports', icon: <AssessmentIcon /> },
          { text: 'Calendar', path: '/faculty/calendar', icon: <CalendarMonthIcon /> },
        ];
      case 'hod':
        return [
          { text: 'Dashboard', path: '/hod/dashboard', icon: <DashboardIcon /> },
          { text: 'Department Overview', path: '/hod/department', icon: <BusinessIcon /> },
          { text: 'Faculty Management', path: '/hod/faculty', icon: <PeopleIcon /> },
          { text: 'Student Analytics', path: '/hod/students', icon: <BarChartIcon /> },
          { text: 'Course Analytics', path: '/hod/courses', icon: <AssessmentIcon /> },
          { text: 'Reports', path: '/hod/reports', icon: <AssessmentIcon /> },
          { text: 'Calendar', path: '/hod/calendar', icon: <CalendarMonthIcon /> },
        ];
      case 'principal':
        return [
          { text: 'Dashboard', path: '/principal/dashboard', icon: <DashboardIcon /> },
          { text: 'Institution Overview', path: '/principal/institution', icon: <AccountBalanceIcon /> },
          { text: 'Department Management', path: '/principal/departments', icon: <BusinessIcon /> },
          { text: 'Faculty Overview', path: '/principal/faculty', icon: <PeopleIcon /> },
          { text: 'Student Analytics', path: '/principal/students', icon: <BarChartIcon /> },
          { text: 'Reports', path: '/principal/reports', icon: <AssessmentIcon /> },
          { text: 'Calendar', path: '/principal/calendar', icon: <CalendarMonthIcon /> },
        ];
      case 'admin':
        return [
          { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
          { text: 'User Management', path: '/admin/users', icon: <PeopleIcon /> },
          { text: 'System Settings', path: '/admin/settings', icon: <SettingsIcon /> },
        ];
      case 'student':
        return [
          { text: 'Student Details', path: '/student/dashboard', icon: <PersonIcon /> },
          { text: 'Academics', path: '/student/academics', icon: <SchoolIcon /> },
          { text: 'Achievements', path: '/student/achievements', icon: <EmojiEventsIcon /> },
          { text: 'Certifications', path: '/student/certifications', icon: <CardMembershipIcon /> },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const drawerContent = (
    <>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: [1],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: '#4568dc' }}>
            {user.first_name ? user.first_name[0] : 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" noWrap>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(69, 104, 220, 0.1)',
                  borderRight: '3px solid #4568dc',
                  '&:hover': {
                    backgroundColor: 'rgba(69, 104, 220, 0.2)',
                  },
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
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
  position="fixed"
  sx={{
    width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
    ml: { md: open ? `${drawerWidth}px` : 0 },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
    zIndex: theme.zIndex.drawer + 1,
    borderRadius: 0, // 👈 This ensures no curved edges
  }}
>

        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {userRole === 'student' ? 'Student Portal' : 'Automated Reporting System'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Search">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                sx={{ mr: 1 }}
                onClick={handleNotificationMenuOpen}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#b06ab3' }}>
                  {user.first_name ? user.first_name[0] : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobile && open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth 
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            width: open ? drawerWidth : 0,
          },
        }}
        open={open}
      >
        {drawerContent}
      </Drawer>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* This creates space at the top for the AppBar */}
        <Outlet />
      </Box>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate(`/${userRole}/profile`)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate(`/${userRole}/settings`)}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        id="notifications-menu"
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        onClick={handleNotificationMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Typography variant="body2">
            <strong>New achievement added</strong>
            <br />
            Student Anusuri Bharathi added a new achievement
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">
            <strong>Report generated</strong>
            <br />
            Semester report for CSE department is ready
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">
            <strong>System update</strong>
            <br />
            New features have been added to the system
          </Typography>
        </MenuItem>
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer', fontWeight: 'medium' }}
            onClick={() => navigate('/notifications')}
          >
            View all notifications
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;
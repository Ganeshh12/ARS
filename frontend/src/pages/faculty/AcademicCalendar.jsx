import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import { calendarApi } from '../../services/calendar-api';

// Icons
import EventIcon from '@mui/icons-material/Event';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EditIcon from '@mui/icons-material/Edit';

// Setup localizer for the calendar
const localizer = momentLocalizer(moment);

// Event types with colors and icons
const eventTypes = {
  'holiday': { label: 'Holiday', color: '#f44336', icon: <CelebrationIcon /> },
  'exam': { label: 'Exam', color: '#2196f3', icon: <SchoolIcon /> },
  'workshop': { label: 'Workshop', color: '#4caf50', icon: <WorkIcon /> },
  'seminar': { label: 'Seminar', color: '#ff9800', icon: <WorkIcon /> },
  'submission': { label: 'Submission', color: '#9c27b0', icon: <AssignmentIcon /> },
  'event': { label: 'Other Event', color: '#757575', icon: <EventIcon /> }
};

const AcademicCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [selectedYears, setSelectedYears] = useState(['all']);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Student years
  const studentYears = [
    { value: 'all', label: 'All Years' },
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' }
  ];

  // Check if user is admin
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setIsAdmin(user.role === 'admin' || user.role === 'hod' || user.role === 'principal');
    }
  }, []);

  // Fetch events when filters change
  useEffect(() => {
    fetchEvents();
  }, [academicYear, selectedEventType, selectedMonth, selectedYears]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Prepare filters
      const filters = {
        academicYear: academicYear,
        eventType: selectedEventType !== 'all' ? selectedEventType : undefined,
        month: selectedMonth !== undefined ? selectedMonth : undefined,
        studentYear: selectedYears.includes('all') ? undefined : selectedYears.join(',')
      };
      
      // Fetch events from API
      const eventsData = await calendarApi.getEvents(filters);
      
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load calendar events. Please try again later.');
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleAcademicYearChange = (event) => {
    setAcademicYear(event.target.value);
  };

  const handleEventTypeChange = (event) => {
    setSelectedEventType(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    const value = event.target.value;
    setSelectedYears(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Navigate to admin page
  const handleAdminClick = () => {
    window.location.href = '/faculty/calendar-admin';
  };

  // Event style customization
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color || '#757575',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        Academic Calendar
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Academic Year</InputLabel>
                    <Select
                      value={academicYear}
                      onChange={handleAcademicYearChange}
                      label="Academic Year"
                    >
                      <MenuItem value="2022-2023">2022-2023</MenuItem>
                      <MenuItem value="2023-2024">2023-2024</MenuItem>
                      <MenuItem value="2024-2025">2024-2025</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={selectedEventType}
                      onChange={handleEventTypeChange}
                      label="Event Type"
                    >
                      <MenuItem value="all">All Events</MenuItem>
                      {Object.entries(eventTypes).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: value.color, mr: 1 }} />
                            {value.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      label="Month"
                    >
                      <MenuItem value={undefined}>All Months</MenuItem>
                      {moment.months().map((month, index) => (
                        <MenuItem key={index} value={index}>{month}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Student Year</InputLabel>
                    <Select
                      multiple
                      value={selectedYears}
                      onChange={handleYearChange}
                      label="Student Year"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip 
                              key={value} 
                              label={studentYears.find(y => y.value === value)?.label || value} 
                              size="small" 
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {studentYears.map((year) => (
                        <MenuItem key={year.value} value={year.value}>
                          {year.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {isAdmin && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<EditIcon />}
                    onClick={handleAdminClick}
                  >
                    Manage Calendar
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
          
          {/* Calendar Tabs */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="calendar view tabs">
                <Tab label="Calendar View" />
                <Tab label="List View" />
              </Tabs>
              
              {/* Calendar View */}
              {tabValue === 0 && (
                <Box sx={{ p: 2, height: 600 }}>
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    date={currentDate}
                    onNavigate={date => setCurrentDate(date)}
                    views={['month', 'week', 'day', 'agenda']}
                    popup
                    tooltipAccessor={event => `${event.title}: ${event.description || 'No description'}`}
                  />
                </Box>
              )}
              
              {/* List View */}
              {tabValue === 1 && (
                <Box sx={{ p: 2 }}>
                  <List>
                    {filteredEvents.length > 0 ? (
                      filteredEvents
                        .sort((a, b) => new Date(a.start) - new Date(b.start))
                        .map((event) => {
                          const eventType = eventTypes[event.event_type] || eventTypes.event;
                          return (
                            <React.Fragment key={event.id}>
                              <ListItem>
                                <ListItemIcon sx={{ color: eventType.color }}>
                                  {eventType.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={event.title}
                                  secondary={
                                    <React.Fragment>
                                      <Typography variant="body2" component="span">
                                        {moment(event.start).format('MMM DD, YYYY')}
                                        {!moment(event.start).isSame(moment(event.end), 'day') && 
                                          ` - ${moment(event.end).format('MMM DD, YYYY')}`}
                                      </Typography>
                                      <br />
                                      <Typography variant="body2" color="text.secondary">
                                        {event.description || 'No description'}
                                      </Typography>
                                    </React.Fragment>
                                  }
                                />
                                <Chip 
                                  label={eventType.label} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: eventType.color, 
                                    color: 'white',
                                    ml: 1
                                  }} 
                                />
                              </ListItem>
                              <Divider variant="inset" component="li" />
                            </React.Fragment>
                          );
                        })
                    ) : (
                      <ListItem>
                        <ListItemText primary="No events found for the selected filters." />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
            </Paper>
          </motion.div>
        </motion.div>
      )}
    </Box>
  );
};

export default AcademicCalendar;
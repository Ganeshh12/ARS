import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import { calendarApi } from '../../services/calendar-api';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Setup localizer for the calendar
const localizer = momentLocalizer(moment);

// Event types with colors
const eventTypes = {
  'holiday': { label: 'Holiday', color: '#f44336' },
  'exam': { label: 'Exam', color: '#2196f3' },
  'workshop': { label: 'Workshop', color: '#4caf50' },
  'seminar': { label: 'Seminar', color: '#ff9800' },
  'submission': { label: 'Submission', color: '#9c27b0' },
  'event': { label: 'Other Event', color: '#757575' }
};

const CalendarAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    event_type: 'event',
    academic_year: '2023-2024',
    student_years: 'all',
    location: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(undefined);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYears, setSelectedYears] = useState(['all']);
  const [successMessage, setSuccessMessage] = useState('');

  // Student years
  const studentYears = [
    { value: 'all', label: 'All Years' },
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' }
  ];

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

  // Form handling
  const handleFormChange = (field) => (event) => {
    setEventForm({
      ...eventForm,
      [field]: event.target.value
    });
  };

  const handleDateChange = (field) => (date) => {
    setEventForm({
      ...eventForm,
      [field]: date.toDate()
    });
  };

  // Dialog handling
  const handleOpenDialog = (event = null) => {
    if (event) {
      // Edit existing event
      setIsEditing(true);
      setSelectedEvent(event);
      setEventForm({
        title: event.title,
        description: event.description || '',
        start_date: new Date(event.start),
        end_date: new Date(event.end),
        event_type: event.event_type,
        academic_year: event.academic_year,
        student_years: event.student_years || 'all',
        location: event.location || ''
      });
    } else {
      // Create new event
      setIsEditing(false);
      setSelectedEvent(null);
      setEventForm({
        title: '',
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        event_type: 'event',
        academic_year: academicYear,
        student_years: 'all',
        location: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // CRUD operations
  const handleSaveEvent = async () => {
    try {
      if (isEditing && selectedEvent) {
        // Update existing event
        await calendarApi.updateEvent(selectedEvent.id, eventForm);
        setSuccessMessage('Event updated successfully');
      } else {
        // Create new event
        await calendarApi.createEvent(eventForm);
        setSuccessMessage('Event created successfully');
      }
      
      // Refresh events
      fetchEvents();
      handleCloseDialog();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (selectedEvent) {
        await calendarApi.deleteEvent(selectedEvent.id);
        setSuccessMessage('Event deleted successfully');
        
        // Refresh events
        fetchEvents();
        handleCloseDeleteDialog();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    }
  };

  // Calendar event handlers
  const handleSelectEvent = (event) => {
    handleOpenDialog(event);
  };

  const handleSelectSlot = ({ start, end }) => {
    setEventForm({
      ...eventForm,
      start_date: start,
      end_date: end
    });
    handleOpenDialog();
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

  // Navigate back to calendar view
  const handleBackToCalendar = () => {
    window.location.href = '/faculty/calendar';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="div">
          Calendar Administration
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToCalendar}
        >
          Back to Calendar
        </Button>
      </Box>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
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
                
                <Grid item xs={12} md={2}>
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
                
                <Grid item xs={12} md={2}>
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
                
                <Grid item xs={12} md={2}>
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
                
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Event
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 2, height: 600 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
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
                  selectable
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  popup
                  tooltipAccessor={event => `${event.title}: ${event.description || 'No description'}`}
                />
              </LocalizationProvider>
            </Paper>
          </motion.div>
        </motion.div>
      )}
      
      {/* Event Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={eventForm.title}
                  onChange={handleFormChange('title')}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={eventForm.description}
                  onChange={handleFormChange('description')}
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={moment(eventForm.start_date)}
                  onChange={handleDateChange('start_date')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="End Date & Time"
                  value={moment(eventForm.end_date)}
                  onChange={handleDateChange('end_date')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={eventForm.event_type}
                    onChange={handleFormChange('event_type')}
                    label="Event Type"
                  >
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
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Academic Year</InputLabel>
                  <Select
                    value={eventForm.academic_year}
                    onChange={handleFormChange('academic_year')}
                    label="Academic Year"
                  >
                    <MenuItem value="2022-2023">2022-2023</MenuItem>
                    <MenuItem value="2023-2024">2023-2024</MenuItem>
                    <MenuItem value="2024-2025">2024-2025</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Student Years</InputLabel>
                  <Select
                    value={eventForm.student_years}
                    onChange={handleFormChange('student_years')}
                    label="Student Years"
                  >
                    <MenuItem value="all">All Years</MenuItem>
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                    <MenuItem value="3">3rd Year</MenuItem>
                    <MenuItem value="4">4th Year</MenuItem>
                    <MenuItem value="1,2">1st & 2nd Years</MenuItem>
                    <MenuItem value="3,4">3rd & 4th Years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={eventForm.location}
                  onChange={handleFormChange('location')}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          {isEditing && (
            <Button 
              color="error" 
              onClick={() => {
                handleCloseDialog();
                handleOpenDeleteDialog(selectedEvent);
              }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Button 
            onClick={handleSaveEvent} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!eventForm.title}
          >
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event "{selectedEvent?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteEvent} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarAdmin;
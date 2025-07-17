import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStudentFilter } from '../../contexts/StudentFilterContext';
import { facultyApi } from '../../services/faculty-api';

const AchievementsManagement = () => {
  const { studentFilter } = useStudentFilter();
  const [achievements, setAchievements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [formData, setFormData] = useState({
    registration_number: '',
    title: '',
    description: '',
    category: '',
    achievement_date: '',
    scope: 'Inside the College'
  });

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

  // Fetch data on component mount and when studentFilter changes
  useEffect(() => {
    fetchData();
  }, [studentFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get students based on filter
      const studentsData = await facultyApi.getStudents({ filter: studentFilter });
      setStudents(studentsData);
      
      // Get achievements for these students
      const achievementsData = [];
      for (const student of studentsData) {
        try {
          const studentDetails = await facultyApi.getStudentDetails(student.registration_number);
          if (studentDetails.achievements && studentDetails.achievements.length > 0) {
            studentDetails.achievements.forEach(achievement => {
              achievementsData.push({
                ...achievement,
                student_name: student.name,
                registration_number: student.registration_number
              });
            });
          }
        } catch (error) {
          console.error(`Error fetching achievements for student ${student.registration_number}:`, error);
        }
      }
      
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load achievements. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      registration_number: '',
      title: '',
      description: '',
      category: '',
      achievement_date: '',
      scope: 'Inside the College'
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (achievement) => {
    setDialogMode('edit');
    setSelectedAchievement(achievement);
    setFormData({
      registration_number: achievement.registration_number,
      title: achievement.title,
      description: achievement.description || '',
      category: achievement.category,
      achievement_date: achievement.achievement_date ? achievement.achievement_date.split('T')[0] : '',
      scope: achievement.scope || 'Inside the College'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'add') {
        // Add achievement logic would go here
        // For now, just update the UI
        const newAchievement = {
          id: Date.now(), // Temporary ID
          ...formData,
          student_name: students.find(s => s.registration_number === formData.registration_number)?.name || 'Unknown'
        };
        setAchievements([...achievements, newAchievement]);
      } else {
        // Update achievement logic would go here
        // For now, just update the UI
        const updatedAchievements = achievements.map(a => 
          a.id === selectedAchievement.id ? { ...a, ...formData } : a
        );
        setAchievements(updatedAchievements);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete achievement logic would go here
      // For now, just update the UI
      setAchievements(achievements.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  // Filter achievements based on search term
  const filteredAchievements = achievements.filter(achievement => 
    achievement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count achievements by category
  const achievementCounts = {
    total: filteredAchievements.length,
    academic: filteredAchievements.filter(a => a.category?.toLowerCase() === 'academic').length,
    technical: filteredAchievements.filter(a => a.category?.toLowerCase() === 'technical').length,
    sports: filteredAchievements.filter(a => a.category?.toLowerCase() === 'sports').length,
    cultural: filteredAchievements.filter(a => a.category?.toLowerCase() === 'cultural').length,
    other: filteredAchievements.filter(a => 
      !['academic', 'technical', 'sports', 'cultural'].includes(a.category?.toLowerCase())
    ).length
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {studentFilter === 'proctoring' 
            ? "Manage Proctoring Students' Achievements" 
            : "Manage All Students' Achievements"}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
            >
              Add Achievement
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Achievement Counts */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Achievement Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{achievementCounts.total}</Typography>
              <Typography variant="body2">Total</Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">{achievementCounts.academic}</Typography>
              <Typography variant="body2">Academic</Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{achievementCounts.technical}</Typography>
              <Typography variant="body2">Technical</Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">{achievementCounts.sports}</Typography>
              <Typography variant="body2">Sports</Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main">{achievementCounts.cultural}</Typography>
              <Typography variant="body2">Cultural</Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary">{achievementCounts.other}</Typography>
              <Typography variant="body2">Other</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => (
            <Grid item xs={12} md={6} lg={4} key={achievement.id}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {achievement.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Student:</strong> {achievement.student_name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {new Date(achievement.achievement_date).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip label={achievement.category} color="primary" size="small" />
                      <Chip label={achievement.scope} variant="outlined" size="small" />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEditDialog(achievement)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(achievement.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No achievements found. Add a new achievement to get started.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Achievement Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Achievement' : 'Edit Achievement'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Student</InputLabel>
                  <Select
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleFormChange}
                    label="Student"
                  >
                    {students.map((student) => (
                      <MenuItem key={student.registration_number} value={student.registration_number}>
                        {student.name} ({student.registration_number})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Achievement Title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    label="Category"
                  >
                    <MenuItem value="Academic">Academic</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Cultural">Cultural</MenuItem>
                    <MenuItem value="Community Service">Community Service</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Achievement Date"
                  name="achievement_date"
                  type="date"
                  value={formData.achievement_date}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Scope</InputLabel>
                  <Select
                    name="scope"
                    value={formData.scope}
                    onChange={handleFormChange}
                    label="Scope"
                  >
                    <MenuItem value="Inside the College">Inside the College</MenuItem>
                    <MenuItem value="University">University</MenuItem>
                    <MenuItem value="State">State</MenuItem>
                    <MenuItem value="National">National</MenuItem>
                    <MenuItem value="International">International</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.registration_number || !formData.title || !formData.category}
          >
            {dialogMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default AchievementsManagement;
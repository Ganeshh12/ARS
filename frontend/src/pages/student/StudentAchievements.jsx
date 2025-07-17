import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, CircularProgress, Alert,
  Card, CardContent, Chip, Divider, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import { Add as AddIcon } from '@mui/icons-material';
import { studentApi } from '../../services/student-api';

const StudentAchievements = () => {
  const [Achievements, setAchievements] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    achievement_date:'',
    scope:'Inside the College'
  });

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleFormChange = (e)=>{
    const {name, value} = e.target;
    setFormData(prev=>({...prev, [name]: value}))
  }

  const handleOpenDialog = ()=>{
    setOpenDialog(true);
    setDialogMode("add");

  }
  
  const handleCloseDialog = ()=>{
    setOpenDialog(false);
  }

  const handleSubmit = ()=>{
    if (dialogMode==="add")
    {
      const newAchievement = {
        id: (Achievements.length)+1,
        title: formData.title,
        description: formData.description,
        achievement_date: formData.achievement_date,
        category: formData.category,
      }
      setAchievements([...Achievements, newAchievement]);
      setOpenDialog(false);
    }
    else{
      alert("Achievement Edited Successfully");
    }
    
  }
  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getStudentProfile();
      setStudent(data);
      setAchievements(data.achievements);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      setError('Failed to load achievements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!student) return <Alert severity="info" sx={{ mt: 2 }}>No student data found.</Alert>;

  return (

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Achievements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your academic and extracurricular achievements
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ 
            background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #3557cb 30%, #9f59a2 90%)',
            }
          }}
        >
          Add Achievement
        </Button>
      </Box>

      {Achievements && Achievements.length > 0 ? (
        <Grid container spacing={3}>
          {Achievements.map((achievement, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{achievement.title}</Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body1" paragraph>
                    {achievement.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip 
                      label={achievement.category} 
                      color="primary" 
                      sx={{ 
                        background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                        color: 'white'
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(achievement.achievement_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>No Achievements Yet</Typography>
          <Typography variant="body1" paragraph>
            You haven't added any achievements to your profile yet.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ 
              background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3557cb 30%, #9f59a2 90%)',
              }
            }}
          >
            Add Your First Achievement
          </Button>
        </Paper>
      )}

  <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
    <DialogTitle>
      {dialogMode === 'add' ? 'Add New Achievement' : 'Edit Achievement'}
    </DialogTitle>
    <DialogContent>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
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
      >
        {dialogMode === 'add' ? 'Add' : 'Update'}
      </Button>
    </DialogActions>
  </Dialog>
</motion.div>
);
};

export default StudentAchievements;
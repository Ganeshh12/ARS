import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserManagement = () => {
  // Mock data for users
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', first_name: 'Admin', last_name: 'User', email: 'admin@example.com', role: 'admin', department: null, is_active: 1 },
    { id: 2, username: 'faculty', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'faculty', department: 'AIML', is_active: 1 },
    { id: 3, username: 'hod', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', role: 'hod', department: 'AIML', is_active: 1 },
    { id: 4, username: 'principal', first_name: 'Robert', last_name: 'Johnson', email: 'robert.johnson@example.com', role: 'principal', department: null, is_active: 1 }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'faculty',
    department: 'AIML',
    is_active: 1
  });

  const handleOpenDialog = (user = null) => {
    if (user) {
      setIsEditing(true);
      setSelectedUser(user);
      setFormData({
        username: user.username,
        password: '',
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        department: user.department || '',
        is_active: user.is_active
      });
    } else {
      setIsEditing(false);
      setSelectedUser(null);
      setFormData({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        role: 'faculty',
        department: 'AIML',
        is_active: 1
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (isEditing) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...formData } : user
      ));
    } else {
      // Create new user
      const newUser = {
        id: users.length + 1,
        ...formData
      };
      setUsers([...users, newUser]);
    }
    setDialogOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'principal':
        return 'secondary';
      case 'hod':
        return 'primary';
      case 'faculty':
        return 'info';
      case 'proctor':
        return 'warning';
      default:
        return 'default';
    }
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add, edit, and manage system users
        </Typography>
      </Box>

      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              System Users
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
              }}
            >
              Add New User
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.toUpperCase()} 
                        color={getRoleColor(user.role)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{user.department || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_active ? 'Active' : 'Inactive'} 
                        color={user.is_active ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(user)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteUser(user.id)}
                        size="small"
                        disabled={user.username === 'admin'} // Prevent deleting admin
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isEditing}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEditing}
                helperText={isEditing ? "Leave blank to keep current password" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                  disabled={formData.username === 'admin'} // Prevent changing admin role
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="principal">Principal</MenuItem>
                  <MenuItem value="hod">HOD</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="proctor">Proctor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={formData.role === 'admin' || formData.role === 'principal'}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.role === 'admin' || formData.role === 'principal' ? '' : formData.department}
                  onChange={handleInputChange}
                  label="Department"
                >
                  <MenuItem value="AIML">Artificial Intelligence & ML</MenuItem>
                  <MenuItem value="CSE">Computer Science</MenuItem>
                  <MenuItem value="IT">Information Technology</MenuItem>
                  <MenuItem value="ECE">Electronics & Communication</MenuItem>
                  <MenuItem value="EEE">Electrical & Electronics</MenuItem>
                  <MenuItem value="MECH">Mechanical</MenuItem>
                  <MenuItem value="CIVIL">Civil</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="is_active"
                  value={formData.is_active}
                  onChange={handleInputChange}
                  label="Status"
                  disabled={formData.username === 'admin'} // Prevent changing admin status
                >
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default UserManagement;
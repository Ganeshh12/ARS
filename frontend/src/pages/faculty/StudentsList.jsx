import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { facultyApi } from '../../services/faculty-api';
import { formatNumber, compareValue } from '../../utils/formatters';
import { useStudentFilter } from '../../contexts/StudentFilterContext';
import ViewFilter from '../../components/common/ViewFilter';

const StudentsList = () => {
  
  const navigate = useNavigate();
  const { studentFilter, toggleStudentFilter } = useStudentFilter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    branch: '',
    semester: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch students data when studentFilter changes
  useEffect(() => {
    fetchStudents();
  }, [studentFilter]);


  
const fetchStudents = async (filterParams = {}) => {
  setLoading(true);
  setError(null);
  try {
    const data = await facultyApi.getStudents({
      branch: filterParams.branch || '',
      semester: filterParams.semester || '',
      filter: studentFilter // 'proctoring' or 'all'
    });

    const mappedStudents = data.map(student => ({
      ...student,
      registration_no: student.registration_number,
      semester: student.current_semester || student.semester,
      attendance_percentage: 90,
      status: student.status || (
        student.cgpa >= 8.5 ? 'Excellent' :
        student.cgpa >= 7.5 ? 'Good' :
        student.cgpa >= 7.0 ? 'Average' : 'At Risk'
      )
    }));

    setStudents(mappedStudents);
  } 
  catch (error) {
    setError('Failed to load students. Please try again.');
    setSnackbar({
      open: true,
      message: 'Failed to load students',
      severity: 'error'
    });
  }
  finally {
    setLoading(false);
  }
};

  const handleFilterViewChange = (event, newFilter) => {
    if (newFilter !== null) {
      toggleStudentFilter(newFilter);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const applyFilters = () => {
    fetchStudents(filters);
  };

  const resetFilters = () => {
    setFilters({
      branch: '',
      semester: ''
    });
    fetchStudents();
  };

  const handleViewStudent = (regNo) => {
    navigate(`/faculty/students/${regNo}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };



  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Student Management
          </Typography>
          
          <ViewFilter/>

        </Box>
        <Typography variant="body1" color="text.secondary">
          {studentFilter === 'proctoring' ? 'View and manage your assigned students' : 'View all the students in your Department'}
        </Typography>
      </Box>

      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name or registration number"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ToggleButtonGroup
                value={studentFilter}
                exclusive
                onChange={handleFilterViewChange}
                aria-label="student filter"
                size="small"
                color="primary"
                sx={{ 
                  mb: { xs: 2, md: 0 },
                  '& .MuiToggleButton-root:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <ToggleButton 
                  value="proctoring" 
                  aria-label="proctoring students"
                  disableRipple
                >
                  My Students
                </ToggleButton>
                <ToggleButton 
                  value="all" 
                  aria-label="all students"
                  disableRipple
                >
                  All Students
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setFilterOpen(!filterOpen)}
                sx={{ mr: 1 }}
              >
                Filters
              </Button>
            </Grid>
            {filterOpen && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Branch</InputLabel>
                        <Select
                          name="branch"
                          value={filters.branch}
                          onChange={handleFilterChange}
                          label="Branch"
                        >
                          <MenuItem value="">All Branches</MenuItem>
                          <MenuItem value="CSE">CSE</MenuItem>
                          <MenuItem value="ECE">ECE</MenuItem>
                          <MenuItem value="MECH">MECH</MenuItem>
                          <MenuItem value="CIVIL">CIVIL</MenuItem>
                          <MenuItem value="IT">IT</MenuItem>
                          <MenuItem value="AIML">AIML</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Semester</InputLabel>
                        <Select
                          name="semester"
                          value={filters.semester}
                          onChange={handleFilterChange}
                          label="Semester"
                        >
                          <MenuItem value="">All Semesters</MenuItem>
                          <MenuItem value="1">Semester 1</MenuItem>
                          <MenuItem value="2">Semester 2</MenuItem>
                          <MenuItem value="3">Semester 3</MenuItem>
                          <MenuItem value="4">Semester 4</MenuItem>
                          <MenuItem value="5">Semester 5</MenuItem>
                          <MenuItem value="6">Semester 6</MenuItem>
                          <MenuItem value="7">Semester 7</MenuItem>
                          <MenuItem value="8">Semester 8</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="outlined" 
                        onClick={resetFilters} 
                        sx={{ mr: 1 }}
                      >
                        Reset
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={applyFilters}
                      >
                        Apply Filters
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', overflow: 'hidden'}}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 630 }}>
                <Table stickyHeader aria-label="students table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Registration No.</TableCell>
                      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Name</TableCell>
                      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Branch</TableCell>
                      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Semester</TableCell>
                      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>CGPA</TableCell>
                      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Status</TableCell>
                      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((student) => (
                          <TableRow hover key={student.registration_no}>
                            <TableCell>{student.registration_no}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.branch}</TableCell>
                            <TableCell>{student.semester}</TableCell>
                            <TableCell>{student.cgpa}</TableCell>
                            <TableCell>
                              <Chip 
                                label={student.status} 
                                color={
                                  student.status === 'Excellent' ? 'success' :
                                  student.status === 'Good' ? 'primary' :
                                  student.status === 'Average' ? 'warning' : 'error'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleViewStudent(student.registration_no)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {studentFilter === 'proctoring' ? 
                            'No students are assigned to you. Please contact the administrator.' : 
                            'No students found matching your criteria.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default StudentsList;
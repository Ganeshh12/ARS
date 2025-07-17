import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import ClearIcon from '@mui/icons-material/Clear';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdmissionsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admissionsData, setAdmissionsData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    branch: '',
    gender: '',
    seatType: '',
    state: '',
    country: ''
  });
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    branches: [],
    genders: [],
    seatTypes: [],
    states: [],
    countries: []
  });

  useEffect(() => {
    fetchFilterOptions();
    fetchAdmissionsData();
  }, []);

  useEffect(() => {
    fetchAdmissionsData();
  }, [filters]);

  useEffect(() => {
    fetchRawData();
  }, [page, rowsPerPage, filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admissions/filter-options');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchAdmissionsData = async () => {
    setLoading(true);
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.seatType) queryParams.append('seatType', filters.seatType);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.country) queryParams.append('country', filters.country);
      
      const queryString = queryParams.toString();
      const url = `http://localhost:5000/api/admissions/analytics${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setAdmissionsData(data);
    } catch (error) {
      console.error('Error fetching admissions data:', error);
      setError('Failed to load admissions analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRawData = async () => {
    try {
      // Build query string from filters and pagination
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', rowsPerPage);
      
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.seatType) queryParams.append('seatType', filters.seatType);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.country) queryParams.append('country', filters.country);
      
      const queryString = queryParams.toString();
      const url = `http://localhost:5000/api/admissions?${queryString}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setRawData(data.data);
      setTotalRows(data.total);
    } catch (error) {
      console.error('Error fetching raw admissions data:', error);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset pagination when filters change
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      branch: '',
      gender: '',
      seatType: '',
      state: '',
      country: ''
    });
    
    // Reset pagination
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  if (loading && !admissionsData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Admissions Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analysis of student admissions data
          </Typography>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name="branch"
                    value={filters.branch}
                    onChange={handleFilterChange}
                    label="Branch"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.branches.map((branch) => (
                      <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    label="Gender"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Seat Type</InputLabel>
                  <Select
                    name="seatType"
                    value={filters.seatType}
                    onChange={handleFilterChange}
                    label="Seat Type"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.seatTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={filters.state}
                    onChange={handleFilterChange}
                    label="State"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.states.map((state) => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={filters.country}
                    onChange={handleFilterChange}
                    label="Country"
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.countries.map((country) => (
                      <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
            
            {/* Active filters */}
            {Object.values(filters).some(value => value !== '') && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(filters).map(([key, value]) => 
                  value ? (
                    <Chip 
                      key={key}
                      label={`${key}: ${value}`}
                      onDelete={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                      color="primary"
                      size="small"
                    />
                  ) : null
                )}
              </Box>
            )}
          </Paper>
        </motion.div>

        {admissionsData && (
          <>
            <motion.div variants={itemVariants}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Total Admissions</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4568dc' }}>
                        {admissionsData.totalAdmissions}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Gender Distribution</Typography>
                      <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                        <Pie 
                          data={{
                            labels: admissionsData.admissionsByGender.labels,
                            datasets: [
                              {
                                data: admissionsData.admissionsByGender.data,
                                backgroundColor: [
                                  'rgba(33, 150, 243, 0.8)',
                                  'rgba(233, 30, 99, 0.8)',
                                  'rgba(156, 39, 176, 0.8)'
                                ]
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Seat Type Distribution</Typography>
                      <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                        <Doughnut 
                          data={{
                            labels: admissionsData.admissionsBySeatType?.labels || [],
                            datasets: [
                              {
                                data: admissionsData.admissionsBySeatType?.data || [],
                                backgroundColor: [
                                  'rgba(76, 175, 80, 0.8)',
                                  'rgba(255, 152, 0, 0.8)',
                                  'rgba(244, 67, 54, 0.8)',
                                  'rgba(156, 39, 176, 0.8)',
                                  'rgba(255, 193, 7, 0.8)'
                                ]
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Paper sx={{ mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="admissions analytics tabs">
                    <Tab label="Branch Distribution" />
                    <Tab label="Geographic Distribution" />
                    <Tab label="Raw Data" />
                  </Tabs>
                </Box>
                
                {/* Branch Distribution Tab */}
                {tabValue === 0 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Admissions by Branch</Typography>
                    <Box sx={{ height: 400 }}>
                      <Bar 
                        data={{
                          labels: admissionsData.admissionsByBranch?.labels || [],
                          datasets: [
                            {
                              label: 'Students',
                              data: admissionsData.admissionsByBranch?.data || [],
                              backgroundColor: [
                                'rgba(69, 104, 220, 0.8)',
                                'rgba(176, 106, 179, 0.8)',
                                'rgba(76, 175, 80, 0.8)',
                                'rgba(255, 152, 0, 0.8)',
                                'rgba(33, 150, 243, 0.8)',
                                'rgba(244, 67, 54, 0.8)'
                              ]
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}
                
                {/* Geographic Distribution Tab */}
                {tabValue === 1 && (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Admissions by State</Typography>
                        <Box sx={{ height: 400 }}>
                          <Bar 
                            data={{
                              labels: admissionsData.admissionsByState?.labels || [],
                              datasets: [
                                {
                                  label: 'Students',
                                  data: admissionsData.admissionsByState?.data || [],
                                  backgroundColor: 'rgba(69, 104, 220, 0.8)'
                                }
                              ]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              indexAxis: 'y',
                              plugins: {
                                legend: {
                                  display: false
                                }
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Admissions by Country</Typography>
                        <Box sx={{ height: 400 }}>
                          <Pie 
                            data={{
                              labels: admissionsData.admissionsByCountry?.labels || [],
                              datasets: [
                                {
                                  data: admissionsData.admissionsByCountry?.data || [],
                                  backgroundColor: [
                                    'rgba(76, 175, 80, 0.8)',
                                    'rgba(255, 152, 0, 0.8)',
                                    'rgba(244, 67, 54, 0.8)',
                                    'rgba(156, 39, 176, 0.8)',
                                    'rgba(255, 193, 7, 0.8)'
                                  ]
                                }
                              ]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Raw Data Tab */}
                {tabValue === 2 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Admissions Raw Data</Typography>
                    <TableContainer>
                      <Table stickyHeader aria-label="admissions table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Registration No.</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Seat Type</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Country</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rawData.map((row) => (
                            <TableRow hover key={row.registration_number}>
                              <TableCell>{row.registration_number}</TableCell>
                              <TableCell>{row.gender}</TableCell>
                              <TableCell>{row.seat_type}</TableCell>
                              <TableCell>{row.branch}</TableCell>
                              <TableCell>{row.state}</TableCell>
                              <TableCell>{row.country}</TableCell>
                            </TableRow>
                          ))}
                          {rawData.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                No data found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={totalRows}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                )}
              </Paper>
            </motion.div>
          </>
        )}
      </motion.div>
    </Box>
  );
};

export default AdmissionsAnalytics;
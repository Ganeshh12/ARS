import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';

const AchievementFilterBar = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (event) => {
    onFilterChange({ ...filters, category: event.target.value });
  };

  const handleTimeRangeChange = (event) => {
    onFilterChange({ ...filters, timeRange: event.target.value });
  };

  const handleSearchChange = (event) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({ category: '', timeRange: 'all', search: '' });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category || ''}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value=""><em>All Categories</em></MenuItem>
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Cultural">Cultural</MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={filters.timeRange || 'all'}
              onChange={handleTimeRangeChange}
              label="Time Range"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search by title or student"
          />
        </Grid>
        
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{ height: '100%' }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AchievementFilterBar;
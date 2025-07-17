import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { achievementsApi } from '../services/achievements-api';

const AchievementExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState({
    Academic: true,
    Technical: true,
    Sports: true,
    Cultural: true,
    General: true,
    Other: true
  });
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);

  // Handle export format change
  const handleFormatChange = (event) => {
    setExportFormat(event.target.value);
  };

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategories({
      ...selectedCategories,
      [event.target.name]: event.target.checked
    });
  };

  // Handle export action
  const handleExport = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get selected categories as an array
      const categories = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
      
      // Prepare export parameters
      const exportParams = {
        categories,
        timeRange,
        includeDetails
      };
      
      // Add includeCharts only for PDF format
      if (exportFormat === 'pdf') {
        exportParams.includeCharts = includeCharts;
      }
      
      // Get export URL based on format
      let exportUrl;
      switch (exportFormat) {
        case 'pdf':
          exportUrl = achievementsApi.exportToPDF(exportParams);
          break;
        case 'excel':
          exportUrl = achievementsApi.exportToExcel(exportParams);
          break;
        case 'csv':
          exportUrl = achievementsApi.exportToCSV(exportParams);
          break;
        default:
          exportUrl = achievementsApi.exportToPDF(exportParams);
      }
      
      // Trigger download by opening URL in new window
      window.open(exportUrl, '_blank');
      
      setSuccess(`Achievement report successfully exported as ${exportFormat.toUpperCase()}`);
    } catch (err) {
      setError('Failed to export achievements');
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Export Achievements</Typography>
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={exportFormat}
              label="Export Format"
              onChange={handleFormatChange}
            >
              <MenuItem value="pdf">PDF Document</MenuItem>
              <MenuItem value="excel">Excel Spreadsheet</MenuItem>
              <MenuItem value="csv">CSV File</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Categories to Include</Typography>
          <FormGroup row>
            {Object.keys(selectedCategories).map(category => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories[category]}
                    onChange={handleCategoryChange}
                    name={category}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </Grid>
        
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                />
              }
              label="Include detailed descriptions"
            />
            
            {exportFormat === 'pdf' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                  />
                }
                label="Include analytics charts"
              />
            )}
          </FormGroup>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={exportFormat === 'pdf' ? <PictureAsPdfIcon /> : <TableChartIcon />}
              endIcon={<FileDownloadIcon />}
              onClick={handleExport}
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? <CircularProgress size={24} /> : `Export as ${exportFormat.toUpperCase()}`}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AchievementExport;
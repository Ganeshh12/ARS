import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Chip,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { reportApi } from '../services/report-api';

const ReportDialog = ({ open, onClose, reportType = 'semester' }) => {
  // Form state
  const [format, setFormat] = useState('pdf');
  const [pdfTemplateStyle, setPdfTemplateStyle] = useState('classic');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([
    'registered_no', 'name', 'branch', 'curr_semester', 'sgpa'
  ]);
  const [regNo, setRegNo] = useState('');
  const [semester, setSemester] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setFormat('pdf');
      setPdfTemplateStyle('classic');
      setIncludeCharts(true);
      setSelectedColumns(['registered_no', 'name', 'branch', 'curr_semester', 'sgpa']);
      setRegNo('');
      setSemester('');
      setAcademicYear('');
      setError(null);
      setSuccess(false);
    }
  }, [open]);
  
  const availableColumns = [
    { value: 'registered_no', label: 'Registration Number' },
    { value: 'name', label: 'Name' },
    { value: 'branch', label: 'Branch' },
    { value: 'curr_semester', label: 'Current Semester' },
    { value: 'sgpa', label: 'SGPA' },
    { value: 'cgpa', label: 'CGPA' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'backlog_count', label: 'Backlog Count' }
  ];
  
  const handleColumnSelect = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };
  
  const handleGenerateReport = async () => {
    if (!regNo) {
      setError('Registration number is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (format === 'pdf') {
        // Generate PDF report
        const url = reportApi.generatePdfReport(regNo, pdfTemplateStyle, includeCharts);
        window.open(url, '_blank');
        setSuccess(true);
      } else if (format === 'excel') {
        // Generate Excel report
        const url = await reportApi.generateExcelReport([regNo], selectedColumns);
        window.open(url, '_blank');
        setSuccess(true);
      } else if (format === 'csv') {
        // Generate CSV report
        const url = await reportApi.generateCsvReport([regNo], selectedColumns);
        window.open(url, '_blank');
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Generate {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Report generated successfully!
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Student Information
            </Typography>
            
            <TextField
              fullWidth
              label="Registration Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              margin="normal"
              required
            />
            
            {reportType === 'semester' && (
              <>
                <TextField
                  fullWidth
                  label="Semester"
                  type="number"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Academic Year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  margin="normal"
                  placeholder="e.g. 2023-2024"
                />
              </>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Report Options
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Report Format</InputLabel>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                label="Report Format"
              >
                <MenuItem value="pdf">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PictureAsPdfIcon sx={{ mr: 1, color: 'error.main' }} />
                    PDF Document
                  </Box>
                </MenuItem>
                <MenuItem value="excel">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TableChartIcon sx={{ mr: 1, color: 'success.main' }} />
                    Excel Spreadsheet
                  </Box>
                </MenuItem>
                <MenuItem value="csv">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TableChartIcon sx={{ mr: 1, color: 'info.main' }} />
                    CSV File
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            
            {format === 'pdf' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Template Style</InputLabel>
                  <Select
                    value={pdfTemplateStyle}
                    onChange={(e) => setPdfTemplateStyle(e.target.value)}
                    label="Template Style"
                  >
                    <MenuItem value="classic">Classic</MenuItem>
                    <MenuItem value="modern">Modern</MenuItem>
                    <MenuItem value="minimal">Minimal</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                    />
                  }
                  label="Include Performance Charts"
                />
              </>
            )}
            
            {(format === 'excel' || format === 'csv') && (
              <>
                <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                  Select columns to include:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {availableColumns.map((column) => (
                    <Chip
                      key={column.value}
                      label={column.label}
                      onClick={() => handleColumnSelect(column.value)}
                      color={selectedColumns.includes(column.value) ? 'primary' : 'default'}
                      variant={selectedColumns.includes(column.value) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleGenerateReport}
          disabled={loading || !regNo}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
// Icons

import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';

// Import the report API service
import { reportApi } from '../../../services/report-api';
import { facultyApi } from '../../../services/faculty-api';
import { useStudentFilter } from '../../../contexts/StudentFilterContext';

//Components
import ViewFilter from  '../../../components/common/ViewFilter';
import SelectReportType from '../../../components/FacultyReports/SelectReportType';
import ReportFormat from '../../../components/FacultyReports/ReportFormat';
import PdfTemplateStyle from '../../../components/FacultyReports/PdfTemplateStyle';
import SelectStudents from '../../../components/FacultyReports/SelectStudents';
import DownloadPdfOptions from '../../../components/FacultyReports/DownloadPdfOptions';


// API URL for direct access
const API_URL = import.meta.env.VITE_API_BASE_URL;

const FacultyReports = () => {
  const { studentFilter, setStudentFilter } = useStudentFilter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [reportType, setReportType] = useState('semester');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [pdfTemplateStyle, setPdfTemplateStyle] = useState('classic');

  const [includeCharts, setIncludeCharts] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([
    'registered_no', 'name', 'branch', 'curr_semester', 'sgpa'
  ]);
  const [recentReports, setRecentReports] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [isIndividual, setIsIndividual] = useState(true);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
 
  
useEffect(()=>{
  fetchData();
},[studentFilter])

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentsData = await facultyApi.getStudents({ filter: studentFilter });
      setStudents(studentsData);

      // Mock recent reports - replace with API call if needed
      setRecentReports([
        { id: 1, name: 'Semester Performance Report', student: 'Anusuri Bharathi', date: '2024-05-08', type: 'pdf' },
        { id: 2, name: 'Achievements Report', student: 'Rahul Sharma', date: '2024-05-07', type: 'excel' },
        { id: 3, name: 'Certifications Report', student: 'Priya Patel', date: '2024-05-06', type: 'pdf' }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStudentSelection = (event) => {
    setSelectedStudents(event.target.value);
  };


  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

const handlePreviewReport = async () => {
  if (selectedStudents.length === 0) {
    setError('Please select at least one student');
    return;
  }

  setError(null);

  try {
    const regNos = selectedStudents.map((s)=>s.registration_number)
    const url = reportApi.previewPdfReport(
      regNos,
      reportType,
      pdfTemplateStyle,
      includeCharts
    );

    const response = await fetch(url);
    // console.log(`Fetching HTML for ${regNo}: ${previewUrl}`);
    if (!response.ok) throw new Error('Failed to fetch preview HTML');

    const html = await response.text(); // get HTML as string
    setHtmlPreview(html);
    setIsDialogOpen(true); // open dialog
  } catch (error) {
    console.error('Error generating preview:', error);
    setError('Failed to generate preview. Please try again.');
  }
};


  // New function to handle confirmation of individual vs combined PDF option
  const handleOptionConfirm = () => {
    setShowReportOptions(false);
    handleGenerateReportConfirmed();
  };

  // Helper function that actually triggers report generation after user confirms option dialog
  const handleGenerateReportConfirmed = async () => {
    setGeneratingReport(true);
    setError(null);

    try {
      if (reportFormat === 'pdf') {
        const regNos = selectedStudents.map((s)=>s.registration_number);
        const isSingle = regNos.length === 1;
        const downloadUrl = reportApi.downloadPdfReport(
          regNos,
          reportType,
          pdfTemplateStyle,
          includeCharts,
          isSingle ? true : isIndividual // for single student always individual
        );

        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;

        if (isSingle) {
          a.download = `${reportType}_report_${regNos}.pdf`;
        } else {
          a.download = isIndividual
            ? `${reportType}_individual_reports_${new Date().toISOString().slice(0, 10)}.zip`
            : `${reportType}_combined_report_${new Date().toISOString().slice(0, 10)}.pdf`;
        }

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
      else if(reportFormat==='excel'){
        const regNos = selectedStudents.map((s)=>s.registration_number);
        const excelUrl = reportApi.generateExcelReport(regNos,selectedColumns);
          const response = await fetch(excelUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
      }
        } catch (error) {
          console.error('Error generating report:', error);
          setError('Failed to generate report. Please try again.');
        } finally {
          setGeneratingReport(false);
        }
      };

  // This triggers the dialog for PDF option selection or directly generates the report if no dialog needed
  const handleGenerateReport = () => {
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }
    setError(null);

    if (reportFormat === 'pdf' && selectedStudents.length > 1) {
      setShowReportOptions(true);
    } else {
      handleGenerateReportConfirmed();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reports
          </Typography>

          <ViewFilter/>

        </Box>
        <Typography variant="body1" color="text.secondary">
          Generate and manage student reports
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Generate Reports" />
        <Tab label="Recent Reports" />
      </Tabs>

      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generate New Report
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Report Configuration
              </Typography>

              <SelectReportType reportType={reportType} setReportType={setReportType} />
              <ReportFormat reportFormat={reportFormat} setReportFormat={setReportFormat} />
              

              {reportFormat === 'pdf' && (
                <>
                  
                  <PdfTemplateStyle pdfTemplateStyle={pdfTemplateStyle} setPdfTemplateStyle={setPdfTemplateStyle}/>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeCharts}
                        onChange={(e) => setIncludeCharts(e.target.checked)}
                      />
                    }
                    label="Include Charts and Visualizations"
                  />

                </>
              )}

              {reportFormat === 'excel' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Columns to Include
                  </Typography>
                  <Grid container spacing={1}>
                    {[
                      { value: 'registered_no', label: 'Registration Number' },
                      { value: 'name', label: 'Name' },
                      { value: 'branch', label: 'Branch' },
                      { value: 'curr_semester', label: 'Current Semester' },
                      { value: 'sgpa', label: 'SGPA' },
                      { value: 'cgpa', label: 'CGPA' },
                      { value: 'attendance', label: 'Attendance' }
                    ].map((column) => (
                      <Grid item xs={6} key={column.value}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedColumns.includes(column.value)}
                              onChange={() => handleColumnToggle(column.value)}
                              size="small"
                            />
                          }
                          label={column.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Student Selection
              </Typography>
              <SelectStudents 
                loading={loading} 
                students={students} 
                selectedStudents={selectedStudents} 
                setSelectedStudents={setSelectedStudents} 
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                {reportFormat === 'pdf' && (
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={handlePreviewReport}
                    disabled={selectedStudents.length === 0 || generatingReport}
                  >
                    Preview
                  </Button>
                )}

                <Button 
                  variant="contained" 
                  startIcon={generatingReport ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                  onClick={handleGenerateReport}
                  disabled={selectedStudents.length === 0 || generatingReport}
                  sx={{ ml: 'auto' }}
                >
                  {generatingReport ? 'Generating...' : 'Generate Report'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Reports
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {recentReports.length > 0 ? (
            <List>
              {recentReports.map((report) => (
                <ListItem
                  key={report.id}
                  divider
                  secondaryAction={
                    <Box>
                      <IconButton color="primary" size="small" sx={{ mr: 1 }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="primary" size="small" sx={{ mr: 1 }}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {report.type === 'pdf' ? (
                      <PictureAsPdfRoundedIcon color="error" />
                    ) : (
                      <TableChartRoundedIcon color="success" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={report.name}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          Student: {report.student}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span" color="text.secondary">
                          Date: {report.date}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No recent reports available.</Typography>
          )}
        </Paper>
      )}

      {/* Dialog for individual vs combined PDF option */}
      
      <DownloadPdfOptions 
        isIndividual={isIndividual} 
        setIsIndividual={setIsIndividual} 
        showReportOptions={showReportOptions} 
        setShowReportOptions={setShowReportOptions}
        handleOptionConfirm={handleOptionConfirm}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Report Preview</DialogTitle>
        <DialogContent dividers>
          <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setIsDialogOpen(false)} color="primary">Close</Button>
        <Button 
          variant="contained" 
          startIcon={generatingReport ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          onClick={handleGenerateReport}
          disabled={selectedStudents.length === 0 || generatingReport}
          sx={{ ml: 'auto' }}
        >
          {generatingReport ? 'Generating...' : 'Generate Report'}
        </Button>
      </DialogActions>
      </Dialog>

    </motion.div>
  );
};

export default FacultyReports;

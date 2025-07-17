undefined
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch students from database
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/students`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        // Fallback to mock data if API fails
        setStudents([
          { id: 1, registration_number: '22A91A6101', name: 'Akella Venkata', branch: 'AIML', curr_semester: 6 },
          { id: 2, registration_number: '22A91A6102', name: 'Anusuri Bharathi', branch: 'AIML', curr_semester: 6 },
          { id: 3, registration_number: '22A91A6103', name: 'Ari Naresh', branch: 'AIML', curr_semester: 6 },
          { id: 4, registration_number: '22A91A6104', name: 'Arugollu Lalu Prasad', branch: 'AIML', curr_semester: 6 },
          { id: 5, registration_number: '22A91A6105', name: 'Ayushi Singh', branch: 'AIML', curr_semester: 6 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Set all students as selected when "All Students" is chosen
  useEffect(() => {
    if (studentSelection === 'all' && students.length > 0) {
      setSelectedStudents(students.map(s => s.registration_number));
    }
  }, [studentSelection, students]);

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

  // Handle form changes
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleReportFormatChange = (e) => {
    setReportFormat(e.target.value);
  };

  const handleStudentSelectionChange = (e) => {
    setStudentSelection(e.target.value);
    if (e.target.value === 'all') {
      setSelectedStudents(students.map(s => s.registration_number));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (e) => {
    setSelectedStudents(e.target.value);
  };

  const handleColumnSelect = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handlePreviewReport = async () => {
    if (selectedStudents.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one student',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the selected student data
      const previewStudent = students.find(s => s.registration_number === selectedStudents[0]);
      
      // For PDF preview, open in a new tab
      if (reportFormat === 'pdf') {
        const url = `${API_URL}/reports/generate-pdf/${selectedStudents[0]}?template=${pdfTemplateStyle}`;
        window.open(url, '_blank');
      } else {
        // For Excel/CSV preview, show in the preview panel
        const previewData = {
          reportType,
          reportFormat,
          student: previewStudent,
          templateStyle: pdfTemplateStyle,
          includeCharts,
          columns: selectedColumns,
          generatedAt: new Date().toISOString()
        };
        
        setPreviewData(previewData);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Preview generated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating preview:', error);
      setError('Failed to generate preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (selectedStudents.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one student',
        severity: 'error'
      });
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Generate PDF with proper content type using the template from templates folder
      if (reportFormat === 'pdf') {
        // For each selected student, generate a PDF
        for (const studentId of selectedStudents) {
          try {
            // Direct download approach using XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${API_URL}/reports/generate-pdf/${studentId}?template=${pdfTemplateStyle}&download=true&t=${Date.now()}`, true);
            xhr.responseType = 'blob';
            
            xhr.onload = function() {
              if (this.status === 200) {
                // Create blob link to download
                const blob = new Blob([this.response], {type: 'application/pdf'});
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${reportType}_report_${studentId}.pdf`;
                
                // Append to html link element page
                document.body.appendChild(link);
                
                // Start download
                link.click();
                
                // Clean up and remove the link
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
              }
            };
            
            xhr.send();
          } catch (err) {
            console.error('Error downloading PDF:', err);
          }
          
          // Wait a bit between requests to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else if (reportFormat === 'excel') {
        // Create a simple Excel XML content
        const excelContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Sheet1">
  <Table>
   <Row>
    ${selectedColumns.map(col => `<Cell><Data ss:Type="String">${availableColumns.find(c => c.value === col)?.label || col}</Data></Cell>`).join('')}
   </Row>
   ${selectedStudents.map(studentId => {
     const student = students.find(s => s.registration_number === studentId);
     return `<Row>
      ${selectedColumns.map(col => {
        let value = '';
        if (col === 'registered_no') value = student?.registration_number || '';
        else if (col === 'name') value = student?.name || '';
        else if (col === 'branch') value = student?.branch || '';
        else if (col === 'curr_semester') value = student?.curr_semester || '';
        else if (col === 'sgpa') value = '8.5'; // Mock data
        else if (col === 'cgpa') value = '8.2'; // Mock data
        else if (col === 'attendance') value = '92%'; // Mock data
        else if (col === 'backlog_count') value = '0'; // Mock data
        
        return `<Cell><Data ss:Type="String">${value}</Data></Cell>`;
      }).join('')}
     </Row>`;
   }).join('')}
  </Table>
 </Worksheet>
</Workbook>`;
        
        const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportType}_report_${new Date().toISOString().slice(0,10)}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Create CSV content
        const headers = selectedColumns.map(col => availableColumns.find(c => c.value === col)?.label || col).join(',');
        const rows = selectedStudents.map(studentId => {
          const student = students.find(s => s.registration_number === studentId);
          return selectedColumns.map(col => {
            let value = '';
            if (col === 'registered_no') value = student?.registration_number || '';
            else if (col === 'name') value = student?.name || '';
            else if (col === 'branch') value = student?.branch || '';
            else if (col === 'curr_semester') value = student?.curr_semester || '';
            else if (col === 'sgpa') value = '8.5'; // Mock data
            else if (col === 'cgpa') value = '8.2'; // Mock data
            else if (col === 'attendance') value = '92%'; // Mock data
            else if (col === 'backlog_count') value = '0'; // Mock data
            
            // Escape commas in values
            if (value.includes(',')) {
              value = `"${value}"`;
            }
            
            return value;
          }).join(',');
        }).join('\n');
        
        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportType}_report_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: `${reportFormat.toUpperCase()} report downloaded successfully!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
      setSnackbar({
        open: true,
        message: 'Failed to generate report. Please try again.',
        severity: 'error'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Report Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure and generate student reports
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Left Side - Input Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Report Configuration
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {/* Report Type */}
                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Report Type</InputLabel>
                          <Select
                            value={reportType}
                            onChange={handleReportTypeChange}
                            label="Report Type"
                          >
                            <MenuItem value="semester">Semester Performance Report</MenuItem>
                            <MenuItem value="cumulative">Cumulative Performance Report</MenuItem>
                            <MenuItem value="subject">Subject Analysis Report</MenuItem>
                            <MenuItem value="achievements">Achievements Report</MenuItem>
                            <MenuItem value="certifications">Certifications Report</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Report Format */}
                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Report Format</InputLabel>
                          <Select
                            value={reportFormat}
                            onChange={handleReportFormatChange}
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
                      </Grid>

                      {/* Student Selection */}
                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Student Selection</InputLabel>
                          <Select
                            value={studentSelection}
                            onChange={handleStudentSelectionChange}
                            label="Student Selection"
                          >
                            <MenuItem value="all">All Students</MenuItem>
                            <MenuItem value="specific">Select Specific Students</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Specific Students Selection */}
                      {studentSelection === 'specific' && (
                        <Grid item xs={12}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Select Students</InputLabel>
                            <Select
                              multiple
                              value={selectedStudents}
                              onChange={handleStudentSelect}
                              label="Select Students"
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip 
                                      key={value} 
                                      label={students.find(s => s.registration_number === value)?.name || value} 
                                      size="small" 
                                    />
                                  ))}
                                </Box>
                              )}
                            >
                              {students.map((student) => (
                                <MenuItem key={student.id} value={student.registration_number}>
                                  {student.name} ({student.registration_number})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}

                      {/* PDF Specific Options */}
                      {reportFormat === 'pdf' && (
                        <>
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>PDF Template Style</InputLabel>
                              <Select
                                value={pdfTemplateStyle}
                                onChange={(e) => setPdfTemplateStyle(e.target.value)}
                                label="PDF Template Style"
                              >
                                <MenuItem value="classic">Classic</MenuItem>
                                <MenuItem value="modern">Modern</MenuItem>
                                <MenuItem value="minimal">Minimal</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Report Type</InputLabel>
                              <Select
                                value={pdfReportType}
                                onChange={(e) => setPdfReportType(e.target.value)}
                                label="Report Type"
                              >
                                <MenuItem value="individual">Individual Reports (One per student)</MenuItem>
                                <MenuItem value="combined">Combined Report (All students)</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={includeCharts}
                                  onChange={(e) => setIncludeCharts(e.target.checked)}
                                  color="primary"
                                />
                              }
                              label="Include Performance Charts"
                            />
                          </Grid>
                        </>
                      )}

                      {/* Excel/CSV Specific Options */}
                      {(reportFormat === 'excel' || reportFormat === 'csv') && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Select Columns to Include
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {availableColumns.map((column) => (
                              <Chip
                                key={column.value}
                                label={column.label}
                                onClick={() => handleColumnSelect(column.value)}
                                color={selectedColumns.includes(column.value) ? 'primary' : 'default'}
                                variant={selectedColumns.includes(column.value) ? 'filled' : 'outlined'}
                                sx={{ mb: 1 }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}

                      {/* Generate Button */}
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={handlePreviewReport}
                            disabled={loading || selectedStudents.length === 0}
                          >
                            Preview
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
                            onClick={handleGenerateReport}
                            disabled={generating || selectedStudents.length === 0}
                            sx={{
                              background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                            }}
                          >
                            {generating ? 'Generating...' : 'Generate Report'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Right Side - Preview */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Report Preview
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '400px',
                      border: '1px dashed #ccc',
                      borderRadius: 1,
                      p: 3
                    }}>
                      {previewData ? (
                        reportFormat === 'pdf' ? (
                          <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <PictureAsPdfIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              PDF Report Preview
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              PDF preview opened in a new tab
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <TableChartIcon sx={{ 
                              fontSize: 60, 
                              color: reportFormat === 'excel' ? 'success.main' : 'info.main', 
                              mb: 2 
                            }} />
                            <Typography variant="h6" gutterBottom>
                              {reportFormat.toUpperCase()} Report Preview
                            </Typography>
                            
                            <Box sx={{ overflowX: 'auto', mb: 2 }}>
                              <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                border: '1px solid #ddd'
                              }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                                    {selectedColumns.map(col => (
                                      <th key={col} style={{ 
                                        border: '1px solid #ddd', 
                                        padding: '8px',
                                        textAlign: 'left'
                                      }}>
                                        {availableColumns.find(c => c.value === col)?.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {(selectedStudents.length > 0 ? 
                                    students.filter(s => selectedStudents.includes(s.registration_number)) : 
                                    students).slice(0, 3).map(student => (
                                    <tr key={student.id}>
                                      {selectedColumns.map(col => (
                                        <td key={`${student.id}-${col}`} style={{ 
                                          border: '1px solid #ddd', 
                                          padding: '8px'
                                        }}>
                                          {col === 'registered_no' ? student.registration_number :
                                           col === 'name' ? student.name :
                                           col === 'branch' ? student.branch :
                                           col === 'curr_semester' ? student.curr_semester :
                                           col === 'sgpa' ? '8.5' :
                                           col === 'cgpa' ? '8.2' :
                                           col === 'attendance' ? '92%' :
                                           col === 'backlog_count' ? '0' : ''}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </Box>
                            
                            {(selectedStudents.length === 0 || selectedStudents.length > 3) && (
                              <Typography variant="caption" color="text.secondary">
                                + {(selectedStudents.length === 0 ? students.length : selectedStudents.length) - 3} more rows
                              </Typography>
                            )}
                          </Box>
                        )
                      ) : (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            Select report options and click "Preview" to see how your report will look
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Preview will update based on your selections
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );


export default ReportManagementPage;
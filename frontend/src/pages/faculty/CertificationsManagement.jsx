import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useStudentFilter } from '../../contexts/StudentFilterContext';
import { facultyApi } from '../../services/faculty-api';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';


import ViewFilter from '../../components/common/ViewFilter';
import CertificationCard from '../../components/CertificationManagement/CertificationCard';
import CertificationDialog from '../../components/CertificationManagement/CertificationDialog';
import CertificatePreviewDialog from '../../components/CertificationManagement/CertificatePreviewDialog';
import CertificationSummary from '../../components/CertificationManagement/CertificationSummary';
import CertificationTabs from '../../components/CertificationManagement/CertificationTabs';
import CertificationStatistics from '../../components/CertificationManagement/CertificationStatistics';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CertificationsManagement = () => {
  const { studentFilter } = useStudentFilter();
  const [students, setStudents] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    registration_number: '',
    title: '',
    description: '',
    certification_type: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    certificate_url: ''
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [viewCertificateDialog, setViewCertificateDialog] = useState(false);
  const [selectedCertificateUrl, setSelectedCertificateUrl] = useState('');
  const [certificateHtml, setCertificateHtml] = useState('');


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
      
      // Get certifications for these students
      const certificationsData = [];
      for (const student of studentsData) {
        try {
          const studentDetails = await facultyApi.getStudentDetails(student.registration_number);
          if (studentDetails.certifications && studentDetails.certifications.length > 0) {
            studentDetails.certifications.forEach(certification => {
              certificationsData.push({
                ...certification,
                student_name: student.name,
                registration_number: student.registration_number,
                student_id: student.id
              });
            });
          }
        } catch (error) {
          console.error(`Error fetching certifications for student ${student.registration_number}:`, error);
        }
      }
      
      setCertifications(certificationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load certifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter certifications based on tab and search term
  const filteredCertifications = certifications
    .filter(cert => {
      if (tabValue === 1) return cert.verified;
      if (tabValue === 2) return !cert.verified;
      return true; // All certifications for tab 0
    })
    .filter(cert => 
      cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuing_organization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Count certifications by type and verification status
  const certificationCounts = {
    total: filteredCertifications.length,
    verified: filteredCertifications.filter(c => c.verified).length,
    pending: filteredCertifications.filter(c => !c.verified).length,
    technical: filteredCertifications.filter(c => c.certification_type === 'technical').length,
    language: filteredCertifications.filter(c => c.certification_type === 'language').length,
    professional: filteredCertifications.filter(c => c.certification_type === 'professional').length,
    softSkills: filteredCertifications.filter(c => c.certification_type === 'soft_skills').length,
    other: filteredCertifications.filter(c => 
      !['technical', 'language', 'professional', 'soft_skills'].includes(c.certification_type)
    ).length
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      student_id: '',
      registration_number: '',
      title: '',
      description: '',
      certification_type: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      certificate_url: ''
    });
    setCertificateFile(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (certification) => {
    setDialogMode('edit');
    setSelectedCertification(certification);
    setFormData({
      student_id: certification.student_id,
      registration_number: certification.registration_number,
      title: certification.title,
      description: certification.description || '',
      certification_type: certification.certification_type,
      issuing_organization: certification.issuing_organization,
      issue_date: certification.issue_date ? certification.issue_date.split('T')[0] : '',
      expiry_date: certification.expiry_date ? certification.expiry_date.split('T')[0] : '',
      credential_id: certification.credential_id || '',
      certificate_url: certification.certificate_url || ''
    });
    setCertificateFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSuccessMessage('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'student_id') {
      const selectedStudent = students.find(s => s.id === parseInt(value));
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        registration_number: selectedStudent ? selectedStudent.registration_number : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
  try {
    let uploadedFilePath = formData.certificate_url;

    if (certificateFile) {
      const uploadData = new FormData();
      uploadData.append('certificate', certificateFile);

      const response = await facultyApi.uploadCertificate(uploadData);
      uploadedFilePath = response.filePath; // This path should be like "/uploads/filename.jpg"
    }

    const certificationData = {
      ...formData,
      certificate_url: uploadedFilePath
    };

    if (dialogMode === 'add') {
      const newCertification = {
        id: Date.now(),
        ...certificationData,
        student_name: students.find(s => s.id === parseInt(formData.student_id))?.name || 'Unknown',
        verified: false
      };
      setCertifications([...certifications, newCertification]);
      setSuccessMessage('Certification added successfully!');
    } else {
      const updatedCertifications = certifications.map(c =>
        c.id === selectedCertification.id ? { ...c, ...certificationData } : c
      );
      setCertifications(updatedCertifications);
      setSuccessMessage('Certification updated successfully!');
    }

    setTimeout(() => {
      handleCloseDialog();
    }, 1500);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};


  const handleDelete = async (id) => {
    try {
      // Delete certification logic would go here
      // For now, just update the UI
      setCertifications(certifications.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting certification:", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      // Verify certification logic would go here
      // For now, just update the UI
      const updatedCertifications = certifications.map(c => 
        c.id === id ? { ...c, verified: true } : c
      );
      setCertifications(updatedCertifications);
    } catch (error) {
      console.error("Error verifying certification:", error);
    }
  };

const handleViewCertificate = async (cert) => {
  try {
    if (cert.certificate_url && cert.certificate_url.startsWith('/uploads')) {
      // Use uploaded file (stored locally on server)
      setSelectedCertificateUrl(cert.certificate_url);
      setCertificateHtml('');
    } else {
      // Fallback to dummy HTML
      const html = await facultyApi.generateDummyCertificate({
        certificationTitle: cert.title,
        student_name: cert.student_name,
        issuer: cert.issuing_organization,
        issueDate: cert.issue_date,
        expiryDate: cert.expiry_date || '',
        credentialId: cert.credential_id || '',
        certification_url: cert.certificate_url || 'https://ofzen.in'
      });
      setCertificateHtml(html);
      setSelectedCertificateUrl('');
    }

    setViewCertificateDialog(true);
  } catch (error) {
    console.error("Error generating or viewing certificate:", error);
  }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom>
            {studentFilter === 'proctoring' 
              ? "Manage Proctoring Students' Certifications" 
              : "Manage All Students' Certifications"}
          </Typography>

          <ViewFilter/>
          
         
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              placeholder="Search certifications..."
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
              Add Certification
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Certification Counts */}
      <CertificationSummary counts={certificationCounts} />


      <Paper sx={{ mb: 3 }}>
        <CertificationTabs
          value={tabValue}
          onChange={handleTabChange}
          count={filteredCertifications.length}
        />
        
        <Box sx={{ p: 3 }}>
          {/* Certifications List (Tabs 0-2) */}
          {tabValue <= 2 && (
            <Grid container spacing={3}>
              {filteredCertifications.length > 0 ? (
                filteredCertifications.map((certification) => (
                  <Grid item xs={12} md={6} lg={4} key={certification.id}>
                    <motion.div variants={itemVariants}>
                         <CertificationCard
                            certification={certification}
                            onEdit={handleOpenEditDialog}
                            onVerify={handleVerify}
                            onDelete={handleDelete}
                            onView={handleViewCertificate}
                          />
                    </motion.div>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No certifications found matching the criteria
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
          
          {/* Statistics Tab */}
         {tabValue === 3 && (
            <CertificationStatistics certifications={certifications} />
          )}
        </Box>
      </Paper>

      {/* Add/Edit Certification Dialog */}
      <CertificationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        mode={dialogMode}
        students={students}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        certificateFile={certificateFile}
        onFileChange={handleFileChange}
        successMessage={successMessage}
      />

      {/* View Certificate Dialog */}
      <CertificatePreviewDialog
        open={viewCertificateDialog}
        onClose={() => setViewCertificateDialog(false)}
        certificateUrl={selectedCertificateUrl}
        certificateHtml={certificateHtml}
      />

    </motion.div>
  );
};

export default CertificationsManagement;
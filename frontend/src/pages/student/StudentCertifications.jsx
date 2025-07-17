import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, CircularProgress, Alert,
  Card, CardContent, Divider, Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { Add as AddIcon, Description } from '@mui/icons-material';
import { studentApi } from '../../services/student-api';
import { facultyApi } from '../../services/faculty-api';

//Components
import CertificationDialog from '../../components/StudentCertifications/CertificationDialog';
import CertificationCard from '../../components/StudentCertifications/CertificationCard';
import CertificatePreviewDialog from '../../components/StudentCertifications/CertificatePreviewDialog';

const StudentCertifications = () => {
  const [student, setStudent] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const studentData = await studentApi.getStudentProfile();
      setStudent(studentData);

      // Get Certification Data
      const certificationData = [];
      try{
        if(studentData.certifications && studentData.certifications.length>0){
          studentData.certifications.forEach(cert => {
            certificationData.push({
              ...cert
            });
          });
        }
      }
      catch(err){
        console.log(`Certificates fetching problem: ${err}`);
      }

      setCertifications(certificationData);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      setError('Failed to load certifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = ()=>{
    setDialogMode('add');
    setSelectedCertification(null);
    setFormData({
      title: '',
      Description: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      certificate_url: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (certification)=>{
    setDialogMode('edit');
    setSelectedCertification(certification);
    setFormData({
      title: certification.title,
      description: certification.description || '',
      certification_type: certification.certification_type,
      issuing_organization: certification.issuing_organization,
      issue_date: certification.issue_date ? certification.issue_date.split('T')[0] : '',
      expiry_date: certification.expiry_date ? certification.expiry_date.split('T')[0] : '',
      credential_id: certification.credential_id || '',
      certificate_url: certification.certificate_url || ''
    });
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCertification(null);
    setSuccessMessage('');
  };
  
  const handleFormChange = (e)=>{
    const {name, value} = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

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
 

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!student) return <Alert severity="info" sx={{ mt: 2 }}>No student data found.</Alert>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Certifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your professional certifications and courses
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ 
            background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #3557cb 30%, #9f59a2 90%)',
            }
          }}
        >
          Add Certification
        </Button>
      </Box>

      {student.certifications && student.certifications.length > 0 ? (
        <Grid container spacing={3}>
          {certifications.map((certification, index) => (
            <Grid item xs={12} md={6} key={index}>
               <CertificationCard
                  certification={certification}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleDelete}
                  onView={handleViewCertificate}
                />

            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>No Certifications Yet</Typography>
          <Typography variant="body1" paragraph>
            You haven't added any certifications to your profile yet.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ 
              background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3557cb 30%, #9f59a2 90%)',
              }
            }}
          >
            Add Your First Certification
          </Button>
        </Paper>
      )}


      {/* Add/Edit Certification Dialog */}
      <CertificationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        mode={dialogMode}
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

export default StudentCertifications;
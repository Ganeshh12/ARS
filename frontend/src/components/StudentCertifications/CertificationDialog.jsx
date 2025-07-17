import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Select, MenuItem, FormControl,
  InputLabel, Alert
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const CertificationDialog = ({
  open,
  onClose,
  mode,
  formData,
  onChange,
  onSubmit,
  certificateFile,
  onFileChange,
  successMessage
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Add New Certification' : 'Edit Certification'}</DialogTitle>
      <DialogContent>
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid item xs={12}>
            <TextField fullWidth label="Certification Title" name="title" value={formData.title} onChange={onChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={onChange} multiline rows={2} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Certification Type</InputLabel>
              <Select name="certification_type" value={formData.certification_type} onChange={onChange}>
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="language">Language</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="soft_skills">Soft Skills</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Issuing Organization" name="issuing_organization" value={formData.issuing_organization} onChange={onChange} required />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Issue Date" name="issue_date" type="date" value={formData.issue_date} onChange={onChange} InputLabelProps={{ shrink: true }} required />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Expiry Date (if applicable)" name="expiry_date" type="date" value={formData.expiry_date} onChange={onChange} InputLabelProps={{ shrink: true }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Credential ID" name="credential_id" value={formData.credential_id} onChange={onChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Certificate URL" name="certificate_url" value={formData.certificate_url} onChange={onChange} />
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
              Upload Certificate
              <input type="file" hidden accept="application/pdf,image/*" onChange={onFileChange} />
            </Button>
            {certificateFile && <div style={{ marginTop: 8 }}>{certificateFile.name}</div>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" disabled={!formData.title || !formData.issue_date || !formData.issuing_organization}>
          {mode === 'add' ? 'Add Certification' : 'Update Certification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificationDialog;
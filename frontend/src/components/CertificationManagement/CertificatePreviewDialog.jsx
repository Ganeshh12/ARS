import {
  Dialog, DialogTitle, DialogContent, IconButton, Box, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CertificatePreviewDialog = ({ open, onClose, certificateUrl, certificateHtml }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: '900px', maxWidth: '95%', maxHeight: '80vh', overflow: 'hidden' } }}
    >
      <DialogTitle>
        Certificate Preview
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <DeleteIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#f9f9f9'
        }}
      >
        {certificateUrl ? (
          certificateUrl.endsWith('.pdf') ? (
            <iframe
              src={certificateUrl}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
              title="Certificate PDF"
            />
          ) : (
            <img
              src={`http://localhost:5000${certificateUrl}`}
              alt="Uploaded Certificate"
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )
        ) : certificateHtml ? (
          <Box
            sx={{
              zoom: '0.8',
              width: '1420px',
              height: '1100px',
              backgroundColor: '#fff',
              position: 'relative',
              top: '5rem',
            }}
            dangerouslySetInnerHTML={{ __html: certificateHtml }}
          />
        ) : (
          <Alert severity="info">No certificate preview available.</Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CertificatePreviewDialog;

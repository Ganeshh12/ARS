import {
  Card, CardContent, CardActions, Typography, Chip, Box, Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const CertificationCard = ({ certification, onEdit, onDelete, onView }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" noWrap>{certification.title}</Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>{certification.description}</Typography>
        <Typography variant="body2"><strong>Issuer:</strong> {certification.issuing_organization}</Typography>
        <Typography variant="body2"><strong>Issue Date:</strong> {new Date(certification.issue_date).toLocaleDateString()}</Typography>
        {certification.expiry_date && (
          <Typography variant="body2"><strong>Expiry Date:</strong> {new Date(certification.expiry_date).toLocaleDateString()}</Typography>
        )}
        {certification.credential_id && (
          <Typography variant="body2"><strong>Credential ID:</strong> {certification.credential_id}</Typography>
        )}
      </CardContent>

      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(certification)}>Edit</Button>
        <IconButton size="small" color="primary" onClick={() => onView(certification)}><VisibilityIcon /></IconButton>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(certification.id)} sx={{ ml: 'auto' }}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default CertificationCard;

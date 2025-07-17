import { Tabs, Tab, Box, Typography, Divider } from '@mui/material';

const CertificationTabs = ({ value, onChange, count }) => {
  return (
    <Box>
      <Tabs 
        value={value}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All Certifications" />
        <Tab label="Verified" />
        <Tab label="Pending Verification" />
        <Tab label="Statistics" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" component="div">
          {value <= 2 ? `${count} Certifications` : 'Certification Statistics'}
        </Typography>
      </Box>

      <Divider />
    </Box>
  );
};

export default CertificationTabs;

import { Card, CardContent, Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';



const StatCard = ({ label, value, Icon, bgColor, iconColor }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>{value}</Typography>
          </Box>
          <Box sx={{ backgroundColor: bgColor, borderRadius: '50%', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon sx={{ color: iconColor }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

const StatCards = ({ dashboardData, itemVariants }) => {
  return (
    <motion.div variants={itemVariants}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Students"
            value={dashboardData.totalStudents}
            Icon={PeopleIcon}
            bgColor="rgba(69, 104, 220, 0.1)"
            iconColor="#4568dc"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Average CGPA"
            value={dashboardData.avgCGPA}
            Icon={AssessmentIcon}
            bgColor="rgba(76, 175, 80, 0.1)"
            iconColor="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Achievements"
            value={dashboardData.achievements}
            Icon={EmojiEventsIcon}
            bgColor="rgba(255, 152, 0, 0.1)"
            iconColor="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Certifications"
            value={dashboardData.certifications}
            Icon={CardMembershipIcon}
            bgColor="rgba(176, 106, 179, 0.1)"
            iconColor="#b06ab3"
          />
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default StatCards;

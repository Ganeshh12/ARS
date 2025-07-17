import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
// Import components
import ViewFilter from '../../components/common/ViewFilter';
import AchievementsManagement from './AchievementsManagement';
import AchievementStats from './AchievementStats';
import AchievementExport from '../../components/AchievementExport';
import { useStudentFilter } from '../../contexts/StudentFilterContext';

// Icons
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const AchievementEnhanced = () => {
  const { studentFilter, setStudentFilter } = useStudentFilter();
  const [tabValue, setTabValue] = useState(0);
  
  // Listen for filter changes from other components
  React.useEffect(() => {
    const handleFilterChange = (event) => {
      console.log(`AchievementEnhanced: Received filter change event: ${event.detail}`);
      if (event.detail !== studentFilter) {
        setStudentFilter(event.detail);
      }
    };
    
    window.addEventListener('studentFilterChanged', handleFilterChange);
    
    return () => {
      window.removeEventListener('studentFilterChanged', handleFilterChange);
    };
  }, [studentFilter, setStudentFilter]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle filter change
  const handleFilterChange = (event) => {
    setStudentFilter(event.target.value);
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Achievement Management System
          </Typography>
          
          <ViewFilter/>
          
        </Box>
        <Typography variant="body1" color="text.secondary">
          {studentFilter === 'proctoring' 
            ? "Manage, analyze, and export your proctoring students' achievements" 
            : "Manage, analyze, and export all students' achievements"}
        </Typography>
      </Box>
      
      <motion.div variants={itemVariants}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<EmojiEventsIcon />} label="Manage" />
            <Tab icon={<BarChartIcon />} label="Statistics" />
            <Tab icon={<FileDownloadIcon />} label="Export" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && <AchievementsManagement />}
            {tabValue === 1 && <AchievementStats />}
            {tabValue === 2 && <AchievementExport />}
          </Box>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default AchievementEnhanced;
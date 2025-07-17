import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
  Fab
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { useStudentFilter } from '../contexts/StudentFilterContext';

const StudentFilterButton = () => {
  const { studentFilter, toggleStudentFilter } = useStudentFilter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filter) => {
    toggleStudentFilter(filter);
    handleClose();
  };

  return (
    <>
      <Tooltip 
        title="Select Student View" 
        placement="left"
        TransitionComponent={Zoom}
      >
        <Fab
          color="primary"
          size="medium"
          aria-label="filter students"
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s'
            }
          }}
        >
          <FilterAltIcon />
        </Fab>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => handleFilterChange('all')}
          selected={studentFilter === 'all'}
        >
          <ListItemIcon>
            <PeopleIcon color={studentFilter === 'all' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText>All Students</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleFilterChange('proctoring')}
          selected={studentFilter === 'proctoring'}
        >
          <ListItemIcon>
            <PersonIcon color={studentFilter === 'proctoring' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText>Proctoring Students</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default StudentFilterButton;
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBus';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingSpinner({ open }) {
  return (
    <Backdrop
      // sx={{ bgcolor: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      open={open}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            borderStyle: 'solid',
            borderColor: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
            borderWidth: '4px',
          }}
        >
          <DirectionsBusOutlinedIcon />
        </Avatar>
        <CircularProgress
          size={40}
          sx={{
            color: 'secondary.light',
            position: 'absolute',
            top: '50%',
            marginTop: '-20px',
            zIndex: 1,
          }}
        />
      </Box>
    </Backdrop>
  );
}

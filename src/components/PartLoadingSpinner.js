import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBus';
import CircularProgress from '@mui/material/CircularProgress';

export default function PartLoadingSpinner() {
  return (
    <Box
      sx={{
        position: 'relative',
        p: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Avatar
        sx={{
          bgcolor: 'secondary.main',
          borderStyle: 'solid',
          width: 32,
          height: 32,
          borderColor: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
          borderWidth: '4px',
        }}
      >
        <DirectionsBusOutlinedIcon />
      </Avatar>
      <CircularProgress
        size={32}
        sx={{
          color: 'secondary.light',
          position: 'absolute',
          top: '50%',
          marginTop: '-16px',
          zIndex: 1,
        }}
      />
    </Box>
  );
}

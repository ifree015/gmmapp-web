import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppSettingContent from './AppSettingContent';

export default function AppSetting() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Box sx={{ pt: 0.125 }} />
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          minHeight: '100vh',
          // overflowY: 'auto',
        }}
      >
        <AppSettingContent />
      </Container>
    </Box>
  );
}

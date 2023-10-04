import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppMenuContent from './AppMenuContent';
// import nativeApp from '@common/utils/nativeApp';

export default function AppMenu() {
  const onClose = useCallback(() => {
    // nativeApp.goBack();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Box sx={{ pt: 0.125 }} /> {/* todo */}
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
        }}
      >
        <AppMenuContent onClose={onClose} />
      </Container>
    </Box>
  );
}

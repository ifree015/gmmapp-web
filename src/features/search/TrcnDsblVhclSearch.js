import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TrcnDsblVhclSearchContent from './TrcnDsblVhclSearchContent';

export default function TrcnDsblVhclSearch() {
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
      {/* <Box sx={{ pt: 0.125 }} /> */}
      <Container
        disableGutters
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
        }}
      >
        <TrcnDsblVhclSearchContent onClose={onClose} />
      </Container>
    </Box>
  );
}

import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TrcnSearchContent from './TrcnSearchContent';

export default function TrcnSearch() {
  const onClose = useCallback(() => {
    // nativeApp.goBack();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
      }}
    >
      <Container
        disableGutters
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
        }}
      >
        <TrcnSearchContent onClose={onClose} />
      </Container>
    </Box>
  );
}

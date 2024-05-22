import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TrcnDsblRgtContent from './TrcnDsblRgtContent';

export default function TrcnDsblRgt() {
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
        <TrcnDsblRgtContent onClose={onClose} />
      </Container>
    </Box>
  );
}

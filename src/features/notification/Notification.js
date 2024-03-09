import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import NotificationContent from './NotificationContent';
// import nativeApp from '@common/utils/nativeApp';

export default function Notification() {
  const onClose = useCallback(() => {
    // nativeApp.goBack();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 2,
          height: 2,
          backgroundColor: (theme) => theme.palette.background.color,
        }}
      />
      <Container component="main" maxWidth="sm">
        <NotificationContent onClose={onClose} />
      </Container>
    </Box>
  );
}

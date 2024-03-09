import React, { useState, useCallback, Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SubMainAppBar from '@features/common/SubMainAppBar';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CentTrcnDsblHeader from './CentTrcnDsblHeader';
import CentTrcnDsblList from './CentTrcnDsblList';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import BottomNavBar from '@features/common/BottomNavBar';
import TrcnDsblRgtDialog from './TrcnDsblRgtDialog';

export default function CentTrcnDsbl() {
  const { reset } = useQueryErrorResetBoundary();
  const [trcnDsblRgtOpen, setTrcnDsblRgtOpen] = useState(false);

  const closeTrcnDsblRgt = useCallback(() => {
    setTrcnDsblRgtOpen(false);
  }, [setTrcnDsblRgtOpen]);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <SubMainAppBar title="센터 단말기장애" spaceHeight={2}>
        <IconButton
          color="inherit"
          aria-label="단말기장애 등록"
          onClick={() => setTrcnDsblRgtOpen(true)}
        >
          <EditOutlinedIcon />
        </IconButton>
      </SubMainAppBar>
      <Container component="main" maxWidth="sm">
        <CentTrcnDsblHeader />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <CentTrcnDsblList />
          </Suspense>
        </ErrorBoundary>
        <Copyright />
        <BackToTop bottomNavBar />
      </Container>
      <BottomNavBar currentNav="/trcndsbl/centtrcndsbl" />
      <TrcnDsblRgtDialog open={trcnDsblRgtOpen} onClose={closeTrcnDsblRgt} />
    </Box>
  );
}

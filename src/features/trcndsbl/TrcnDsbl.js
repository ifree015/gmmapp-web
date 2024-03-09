import React, { useState, useCallback, Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SubAppBar from '@features/common/SubAppBar';
import TrcnDsblHeader from './TrcnDsblHeader';
import TrcnDsblList from './TrcnDsblList';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import BottomToolbar from '@features/common/BottomToolbar';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TrcnDsblRgtDialog from './TrcnDsblRgtDialog';

export default function TrcnDsbl() {
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
      <SubAppBar title="단말기 장애"></SubAppBar>
      <Container component="main" maxWidth="sm">
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <TrcnDsblHeader />
            <TrcnDsblList />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pt: 5 }} />
        <BackToTop bottomToolBar />
      </Container>
      <BottomToolbar>
        <IconButton onClick={() => setTrcnDsblRgtOpen(true)}>
          <EditOutlinedIcon />
        </IconButton>
      </BottomToolbar>
      <TrcnDsblRgtDialog open={trcnDsblRgtOpen} onClose={closeTrcnDsblRgt} />
    </Box>
  );
}

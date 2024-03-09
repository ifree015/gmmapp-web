import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SubAppBar from '@features/common/SubAppBar';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import TchmOpgtOcrnHeader from './TchmOpgtOcrnHeader';
import TchmOpgtOcrnList from './TchmOpgtOcrnList';

export default function TchmOpgtOcrn() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <SubAppBar title="타코개폐발생"></SubAppBar>
      <Container component="main" maxWidth="sm">
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <TchmOpgtOcrnHeader />
            <TchmOpgtOcrnList />
          </Suspense>
        </ErrorBoundary>
        <Copyright />
        <BackToTop />
      </Container>
    </Box>
  );
}

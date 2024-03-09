import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SubMainAppBar from '@features/common/SubMainAppBar';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import BottomNavBar from '@features/common/BottomNavBar';
import VhclHeader from './VhclHeader';
import VhclList from './VhclList';

export default function Vhcl() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <SubMainAppBar title="차량"></SubMainAppBar>
      <Container component="main" maxWidth="sm">
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <VhclHeader />
            <VhclList />
          </Suspense>
        </ErrorBoundary>
        <Copyright />
        <BackToTop bottomNavBar />
      </Container>
      <BottomNavBar currentNav="/baseinf/vhcl" />
    </Box>
  );
}

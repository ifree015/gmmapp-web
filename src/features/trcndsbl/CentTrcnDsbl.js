import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import SubAppBar from '@features/common/SubAppBar';
import CentTrcnDsblHeader from './CentTrcnDsblHeader';
import CentTrcnDsblList from './CentTrcnDsblList';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ElevationScroll from '@components/ElevationScroll';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import BottomNavBar from '@features/common/BottomNavBar';
import nativeApp from '@common/utils/nativeApp';

export default function CentTrcnDsbl() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      {!nativeApp.isIOS() ? (
        <ElevationScroll>
          <SubAppBar title="센터 단말기장애"></SubAppBar>
        </ElevationScroll>
      ) : (
        <Box sx={{ pt: 0.125 }} />
      )}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
        }}
      >
        {!nativeApp.isIOS() ? (
          <Toolbar id="back-to-top-anchor" variant="dense" />
        ) : (
          <Toolbar id="back-to-top-anchor" sx={{ minHeight: 0, height: 0 }} />
        )}
        <CentTrcnDsblHeader />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <CentTrcnDsblList />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pt: 3, pb: 'calc(env(safe-area-inset-bottom) + 8px)' }} />
        <BackToTop
          bottom={nativeApp.isIOS() ? 'calc(env(safe-area-inset-bottom) + 16px)' : '72px'}
        />
      </Container>
      <BottomNavBar currentNav="/centtrcndsbl" />
    </Box>
  );
}

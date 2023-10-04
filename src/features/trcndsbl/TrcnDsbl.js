import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import SubAppBar from '@features/common/SubAppBar';
import TrcnDsblHeader from './TrcnDsblHeader';
import TrcnDsblList from './TrcnDsblList';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ElevationScroll from '@components/ElevationScroll';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import BottomNavBar from '@features/common/BottomNavBar';
import nativeApp from '@common/utils/nativeApp';

export default function TrcnDsbl() {
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
          <SubAppBar title="단말기 장애"></SubAppBar>
        </ElevationScroll>
      ) : null}
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
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <TrcnDsblHeader id={nativeApp.isIOS() ? 'back-to-top-anchor' : ''} />
            <TrcnDsblList />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pt: 3, pb: 'calc(env(safe-area-inset-bottom) + 8px)' }} />
        <BackToTop
          bottom={nativeApp.isIOS() ? 'calc(env(safe-area-inset-bottom) + 16px)' : '72px'}
        />
      </Container>
      <BottomNavBar currentNav="/trcndsbl" />
    </Box>
  );
}

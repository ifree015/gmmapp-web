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
    <Box>
      <ElevationScroll>
        <SubAppBar title="단말기 장애" search={false}></SubAppBar>
      </ElevationScroll>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          minHeight: '100vh',
        }}
      >
        <Toolbar id="back-to-top-anchor" />
        <TrcnDsblHeader />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <TrcnDsblList />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pt: 3, pb: 1 }} />
        <BackToTop bottom={nativeApp.isNativeApp() ? '72px' : '16px'} />
      </Container>
      <BottomNavBar currentNav="/trcndsbl" />
    </Box>
  );
}

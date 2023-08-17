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
    <Box>
      <ElevationScroll>
        <SubAppBar title="센터 단말기장애"></SubAppBar>
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
        <Toolbar id="back-to-top-anchor" variant="dense" />
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
        <Copyright sx={{ pt: 3, pb: 1 }} />
        <BackToTop bottom={nativeApp.isIOS() ? '16px' : '72px'} />
      </Container>
      <BottomNavBar currentNav="/centtrcndsbl" />
    </Box>
  );
}

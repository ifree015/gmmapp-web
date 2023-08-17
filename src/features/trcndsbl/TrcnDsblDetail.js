import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import DetailAppBar from '@features/common/DetailAppBar';
// import Skeleton from '@mui/material/Skeleton';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import TrcnDsblDetailContent from './TrcnDsblDetailContent';
import HideOnScroll from '@components/HideOnScroll';
// import BackToTop from '@components/BackToTop';
import Copyright from '@features/common/Copyright';
import nativeApp from '@common/utils/nativeApp';

export default function TrcnDsblDetail() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      {nativeApp.isIOS() ? (
        <Box sx={{ py: 0.25 }} />
      ) : (
        <HideOnScroll threshold={42}>
          <DetailAppBar title="단말기장애 상세"></DetailAppBar>
        </HideOnScroll>
      )}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          // backgroundColor: (theme) =>
          //   theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          minHeight: '100vh',
        }}
      >
        <Toolbar id="back-to-top-anchor" sx={{ minHeight: { xs: 0, sm: 0 } }} />
        <Suspense fallback={<PartLoadingSpinner />}>
          <TrcnDsblDetailContent />
        </Suspense>
        <Copyright sx={{ pt: 3, pb: 'calc(env(safe-area-inset-bottom) / 1 + 8px)' }} />
        {/* <BackToTop /> */}
      </Container>
    </Box>
  );
}

// function TrcnDsblDetailSkeleton() {
//   return (
//     <React.Fragment>
//       <Skeleton variant="rounted" width={'90%'} height={30} sx={{ mt: 2, ml: 'auto' }}></Skeleton>
//       <Skeleton variant="rounted" width={'100%'} height={48} sx={{ mt: 1 }}></Skeleton>
//       <Skeleton variant="rounted" width={'100%'} height={360} sx={{ mt: 0.25 }}></Skeleton>
//     </React.Fragment>
//   );
// }

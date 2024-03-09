import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DetailAppBar from '@features/common/DetailAppBar';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import TrcnDsblDetailContent from './TrcnDsblDetailContent';
import BackToTop from '@components/BackToTop';

export default function TrcnDsblDetail() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <DetailAppBar hideOnScroll title="단말기장애 상세"></DetailAppBar>
      <Container component="main" maxWidth="sm">
        <Suspense fallback={<PartLoadingSpinner />}>
          <TrcnDsblDetailContent />
        </Suspense>
        <Copyright />
        <BackToTop />
      </Container>
    </Box>
  );
}

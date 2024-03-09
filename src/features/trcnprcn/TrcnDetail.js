import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DetailAppBar from '@features/common/DetailAppBar';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import TrcnDetailContent from './TrcnDetailContent';
import BackToTop from '@components/BackToTop';

export default function TrcnDetail() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <DetailAppBar title="단말기 상세"></DetailAppBar>
      <Container component="main" maxWidth="sm">
        <Suspense fallback={<PartLoadingSpinner />}>
          <TrcnDetailContent />
        </Suspense>
        <Copyright />
        <BackToTop />
      </Container>
    </Box>
  );
}

import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DetailAppBar from '@features/common/DetailAppBar';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import TchmOpgtOcrnDetailContent from './TchmOpgtOcrnDetailContent';
import BackToTop from '@components/BackToTop';

export default function TchmOpgtOcrnDetail() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <DetailAppBar title="타코개폐발생 상세"></DetailAppBar>
      <Container component="main" maxWidth="sm">
        <Suspense fallback={<PartLoadingSpinner />}>
          <TchmOpgtOcrnDetailContent />
        </Suspense>
        <Copyright />
        <BackToTop />
      </Container>
    </Box>
  );
}

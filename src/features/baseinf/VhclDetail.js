import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DetailAppBar from '@features/common/DetailAppBar';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import VhclDetailContent from './VhclDetailContent';

export default function VhclDetail() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <DetailAppBar title="차량 상세"></DetailAppBar>
      <Container component="main" maxWidth="sm">
        <Suspense fallback={<PartLoadingSpinner />}>
          <VhclDetailContent />
        </Suspense>
        <Copyright />
      </Container>
    </Box>
  );
}

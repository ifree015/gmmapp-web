import React, { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import DetailAppBar from '@features/common/DetailAppBar';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
// import BackToTop from '@components/BackToTop';
import Copyright from '@features/common/Copyright';
import { useQuery } from '@common/queries/query';
import { fetchTrcnLocNcnt } from '@features/trcnprcn/trcnPrcnAPI';
import nativeApp from '@common/utils/nativeApp';
import BackToTop from '@components/BackToTop';
import TrcnLocDetailCard from './TrcnLocDetailCard';
import TrcnLocDetailList from './TrcnLocDetailList';

export default function TrcnLocDetail() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <DetailAppBar title="단말기위치 상세"></DetailAppBar>
      <Container component="main" maxWidth="sm">
        <Suspense fallback={<PartLoadingSpinner />}>
          <TrcnLocDetailContent />
        </Suspense>
        <Copyright />
        <BackToTop />
      </Container>
    </Box>
  );
}

function TrcnLocDetailContent() {
  const { prsLocId } = useParams();

  const { data } = useQuery(['fetchTrcnLocNcnt'], () => fetchTrcnLocNcnt({ prsLocId }), {
    select: ({ data }) => {
      return data;
    },
  });

  useEffect(() => {
    if (data) return;
    nativeApp.setViewInfo({
      title: '단말기위치 상세',
      subTitle: `${data.trcnLocNcnt[0].intgAstsBzDvsNm} - ${data.trcnLocNcnt[0].prsLocNm}`,
    });
  }, [data]);

  return (
    <React.Fragment>
      <TrcnLocDetailCard trcnLoc={data.trcnLocNcnt} />
      <TrcnLocDetailList trcnEqpms={data.trcnEqptNcnts} />
    </React.Fragment>
  );
}

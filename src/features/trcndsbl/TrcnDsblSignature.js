import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import { useQuery } from '@common/queries/query';
import { fetchTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import TrcnDsblSignatureContent from './TrcnDsblSignatureContent';

export default function TrcnDsblSignature() {
  const [trcnDsbl, setTrcnDsbl] = useState();
  const { stlmAreaCd, dsblAcptNo } = useParams();

  useQuery(
    ['fetchTrcnDsbl', stlmAreaCd, dsblAcptNo],
    () => fetchTrcnDsbl({ stlmAreaCd, dsblAcptNo }),
    {
      enabled: trcnDsbl ? false : true,
      suspense: false,
      onSuccess: ({ data }) => {
        // console.log(JSON.stringify(data));
        setTrcnDsbl(data);
      },
    }
  );

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 2,
          height: 2,
          backgroundColor: (theme) => theme.palette.background.color,
        }}
      />
      <Container component="main" maxWidth="sm">
        <TrcnDsblSignatureContent trcnDsbl={trcnDsbl ?? { stlmAreaCd, dsblAcptNo, dltYn: 'Y' }} />
      </Container>
    </Box>
  );
}

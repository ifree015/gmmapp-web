import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import { useQuery } from '@common/queries/query';
import { fetchTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import TrcnDsblSignatureContent from './TrcnDsblSignatureContent';

export default function TrcnDsblSignature() {
  const [trcnDsbl, setTrcnDsbl] = useState();
  const { stlmAreaCd, dsblAcptNo } = useParams();

  useQuery(
    ['readTrcnDsbl', stlmAreaCd, dsblAcptNo],
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
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Box sx={{ pt: 0.125 }} /> {/* todo */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
        }}
      >
        <TrcnDsblSignatureContent trcnDsbl={trcnDsbl ?? { stlmAreaCd, dsblAcptNo, dltYn: 'Y' }} />
      </Container>
    </Box>
  );
}

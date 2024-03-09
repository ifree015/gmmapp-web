import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Card from '@mui/material/Card';
import ShadowCard from '@components/ShadowCard';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import nativeApp from '@common/utils/nativeApp';

function groupBy(input, key1, key2) {
  return input.reduce((acc, currentValue) => {
    let groupKey = currentValue[key1] + currentValue[key2];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(currentValue);
    return acc;
  }, {});
}

const avatarRegexp = /B\d{3,}/gi;

export default function TrcnLocDetailList({ trcnEqpms }) {
  const groupedTrcnEqpms = useMemo(() => groupBy(trcnEqpms, 'trcnDvsCd', 'eqpmDvsCd'), [trcnEqpms]);

  return Object.entries(groupedTrcnEqpms).map(([trcnDvs, trcnEqpms], index) => (
    <ShadowCard sx={{ mt: 2 }} key={trcnDvs}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: (theme) => theme.palette.info.light, width: 56 }} variant="square">
            {String(trcnEqpms[0].trcnDvsNm.match(avatarRegexp)).substring(0, 4)}
          </Avatar>
        }
        titleTypographyProps={{
          color: 'primary',
          variant: 'subtitle1',
          fontWeight: (theme) => theme.typography.fontWeightBold,
        }}
        title={trcnEqpms[0].trcnDvsNm}
        subheaderTypographyProps={{
          fontWeight: (theme) => theme.typography.fontWeightBold,
        }}
        subheader={trcnEqpms[0].eqpmDvsNm}
      ></CardHeader>
      <Divider variant="inset" textAlign="left">
        <Chip
          label="상태"
          sx={{
            'height': 20,
            'fontSize': 'caption.fontSize',
            '& .MuiChip-label': { px: 1 },
          }}
        />
      </Divider>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <TrcnLocDetailListContent trcnEqpms={trcnEqpms} />
      </CardContent>
    </ShadowCard>
  ));
}

function TrcnLocDetailListContent({ trcnEqpms }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTrcnStaCd = (params) => {
    const queryParams = params;
    if (nativeApp.isIOS()) {
      nativeApp.pushView('/trcnprcn/trcn?' + new URLSearchParams(queryParams).toString(), {
        title: '단말기',
      });
    } else {
      navigate('/trcnprcn/trcn?' + new URLSearchParams(queryParams).toString(), {
        state: { from: location.pathname },
      });
    }
  };

  return (
    <Grid container spacing={1}>
      {trcnEqpms.map((item, index) => (
        <Grid
          item
          xs={6}
          key={`${item.trcnDvsCd}${item.eqpmDvsCd}-${index}`}
          onClick={() => handleTrcnStaCd(item)}
        >
          <Typography
            variant="body2"
            component="span"
            sx={{
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
          >
            {`${item.intgTrcnStaNm}: `}
          </Typography>
          <Typography variant="body2" component="span">
            {`${item.cnt} 건`}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}

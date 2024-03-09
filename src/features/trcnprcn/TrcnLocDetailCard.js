import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Card from '@mui/material/Card';
import ShadowCard from '@components/ShadowCard';
import CardHeader from '@mui/material/CardHeader';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import HybridLink from '@app//HybridLink';
import nativeApp from '@common/utils/nativeApp';

export default function TrcnLocDetailCard({ trcnLoc }) {
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
    <ShadowCard sx={{ mt: 3 }}>
      <CardActionArea
        component={HybridLink}
        to={`/trcnprcn/trcn?${new URLSearchParams({
          intgAstsBzDvsCd: trcnLoc[0].intgAstsBzDvsCd,
          intgAstsBzDvsNm: trcnLoc[0].intgAstsBzDvsNm,
          prsLocId: trcnLoc[0].prsLocId,
          prsLocNm: trcnLoc[0].prsLocNm,
        }).toString()}`}
        state={{
          from: location.pathname,
          title: '단말기',
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: 'warning.main',
              }}
              aria-label="center"
            >
              <DeviceHubOutlinedIcon />
            </Avatar>
          }
          title={`${trcnLoc[0].intgAstsBzDvsNm} - ${trcnLoc[0].prsLocNm}`}
          titleTypographyProps={{
            variant: 'h6',
            fontWeight: (theme) => theme.typography.fontWeightBold,
            color: 'primary',
          }}
        ></CardHeader>
      </CardActionArea>
      <CardContent>
        <Grid container spacing={1}>
          {trcnLoc.map((item, index) => (
            <Grid
              item
              xs={6}
              key={`${item.prsLocId}-${index}`}
              onClick={() => handleTrcnStaCd(item)}
            >
              <Typography
                variant="subtitle1"
                component="span"
                sx={{
                  color: 'text.secondary',
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                }}
              >
                {`${item.intgTrcnStaNm}: `}
              </Typography>
              <Typography variant="subtitle2" component="span" sx={{ color: 'text.secondary' }}>
                {`${item.cnt} 건`}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </ShadowCard>
  );
}

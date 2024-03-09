import React from 'react';
import { useLocation } from 'react-router-dom';
import HybridLink from '@app//HybridLink';
// import Card from '@mui/material/Card';
import ShadowCard from '@components/ShadowCard';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import Carousel from 'react-material-ui-carousel';

export default function TrcnLocCards({ trcnLocs }) {
  const filteredTrcnLocs = Object.values(trcnLocs)
    .filter((trcnLoc) => trcnLoc[0].prmtSrsq < 99)
    .sort((a, b) => a.prmtSrsq - b.prmtSrsq);
  const maxTrcnStaCnt = filteredTrcnLocs.reduce(
    (maxCnt, trcnLoc) => Math.max(maxCnt, trcnLoc.length),
    0
  );

  return (
    <Carousel
      sx={{ mt: 3, height: 168 }}
      fullHeightHover={true}
      indicatorContainerProps={{ style: { zIndex: 1, position: 'relative', marginTop: '-24px' } }}
    >
      {filteredTrcnLocs.map((trcnLoc) => (
        <TrcnLocCard key={trcnLoc[0].prsLocId} trcnLoc={trcnLoc} maxTrcnStaCnt={maxTrcnStaCnt} />
      ))}
    </Carousel>
  );
}

function TrcnLocCard({ trcnLoc, maxTrcnStaCnt }) {
  const location = useLocation();

  return (
    <ShadowCard>
      <CardActionArea
        component={HybridLink}
        to={`/trcnprcn/trcnloc/${trcnLoc[0].prsLocId}`}
        state={{
          from: location.pathname,
          title: '단말기위치 상세',
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
        <CardContent>
          <Grid container spacing={1}>
            {trcnLoc.map((item, index) => (
              <Grid item xs={6} key={`${item.prsLocId}-${index}`}>
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
            {Array(maxTrcnStaCnt - trcnLoc.length)
              .fill()
              .map((_, index) => (
                <Grid item xs={6} key={`${trcnLoc[0].prsLocId}-${maxTrcnStaCnt + index}`}>
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      fontWeight: (theme) => theme.typography.fontWeightBold,
                    }}
                  >
                    {'\x00'}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </CardActionArea>
    </ShadowCard>
  );
}

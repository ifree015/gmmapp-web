import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import HybridLink from '@app//HybridLink';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import DepartureBoardOutlinedIcon from '@mui/icons-material/DepartureBoardOutlined';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import RunCircleOutlinedIcon from '@mui/icons-material/RunCircleOutlined';
import Carousel from 'react-material-ui-carousel';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { useQuery } from '@common/queries/query';
import { fetchCentByTrcnDsblNcnt } from '@features/trcndsbl/trcnDsblAPI';
import useUser from '@common/hooks/useUser';
import { CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import nativeApp from '@common/utils/nativeApp';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const numberFormat = new Intl.NumberFormat();

export default function TrcnDsblDshCentCards() {
  const user = useUser();

  const queryParams = {
    dsblAcptDt: dayjs().format('YYYYMMDD'),
    dprtId: user.isCenterUser() ? user.dprtId : '',
  };

  const { data: centTrcnDsbls } = useQuery(
    ['fetchCentByTrcnDsblNcnt'],
    () => fetchCentByTrcnDsblNcnt(queryParams),
    {
      select: ({ data }) => {
        return data;
      },
    }
  );

  return (
    <Carousel
      animation="slide"
      navButtonsAlwaysInvisible
      indicatorContainerProps={{ style: { zIndex: 1, position: 'relative', marginTop: '-24px' } }}
      sx={{
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
            : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
        height: 208,
      }}
    >
      {centTrcnDsbls.map((centTrcnDsbl) => (
        <TrcnDsblDshCentCard key={centTrcnDsbl.dprtId} centTrcnDsbl={centTrcnDsbl} />
      ))}
    </Carousel>
  );
}

function TrcnDsblDshCentCard({ centTrcnDsbl }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const chartData = {
    labels: ['처리', '미처리'],
    datasets: [
      {
        label: '장애 건',
        data: [centTrcnDsbl.prcgNcnt, centTrcnDsbl.uproNcnt],
        backgroundColor: [
          theme.palette.mode === 'light'
            ? alpha(theme.palette.success.light, 0.2)
            : alpha(theme.palette.success.light, 0.5),
          theme.palette.mode === 'light'
            ? alpha(theme.palette.warning.light, 0.2)
            : alpha(theme.palette.warning.light, 0.5),
        ],
        borderColor: [theme.palette.success.light, theme.palette.warning.light],
        borderWidth: 1,
      },
    ],
  };

  const centNcnts = [
    {
      id: CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
      title: '접수',
      color: 'info',
      icon: <DepartureBoardOutlinedIcon />,
      ncnt: centTrcnDsbl.ncnt,
    },
    {
      id: CENT_TRCN_DSBL_CATEGORY.CENT_PRCG_FN.id,
      title: '처리',
      color: 'success',
      icon: <DirectionsBusOutlinedIcon />,
      ncnt: centTrcnDsbl.prcgNcnt,
    },
    {
      id: CENT_TRCN_DSBL_CATEGORY.CENT_UPRO.id,
      title: '미처리',
      color: 'warning',
      icon: <RunCircleOutlinedIcon />,
      ncnt: centTrcnDsbl.uproNcnt,
    },
  ];

  const queryParams = {
    categoryId: CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
    dsblAcptDt: dayjs().format('YYYYMMDD'),
    dprtId: centTrcnDsbl.dprtId,
  };

  const handleCentTrcnDsbl = (categoryId) => {
    queryParams.categoryId = categoryId;
    if (nativeApp.isIOS()) {
      nativeApp.pushView('/trcndsbl/centtrcndsbl?' + new URLSearchParams(queryParams).toString(), {
        title: '센터 단말기장애',
      });
    } else {
      navigate('/trcndsbl/centtrcndsbl?' + new URLSearchParams(queryParams).toString(), {
        state: { from: location.pathname },
      });
    }
  };

  return (
    <Card elevation={0}>
      <CardActionArea
        component={HybridLink}
        to={`/trcndsbl/centtrcndsbl?` + new URLSearchParams(queryParams).toString()}
        state={{
          from: location.pathname,
          title: '센터 단말기장애',
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: 'warning.light',
                // background: (theme) =>
                //   `linear-gradient(to right bottom, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
              }}
              aria-label="center"
            >
              <DeviceHubOutlinedIcon />
            </Avatar>
          }
          title={centTrcnDsbl.dprtNm}
          titleTypographyProps={{
            variant: 'h6',
            fontWeight: (theme) => theme.typography.fontWeightBold,
            color: 'info.main',
          }}
        ></CardHeader>
      </CardActionArea>
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 0,
        }}
      >
        <Box
          sx={{
            width: 112,
            height: 112,
          }}
        >
          <Pie data={chartData} options={chartOptions} />
        </Box>
        <ButtonGroup orientation="vertical" color="info" variant="text" sx={{ minWidth: 136 }}>
          {centNcnts.map((centNcnt, index) => (
            <Button
              key={centNcnt.id}
              startIcon={centNcnt.icon}
              sx={{ justifyContent: 'flex-start' }}
              color={centNcnt.color}
              onClick={() => handleCentTrcnDsbl(centNcnt.id)}
            >
              <strong>{centNcnt.title}:&nbsp;</strong> {numberFormat.format(centNcnt.ncnt)} 건
            </Button>
          ))}
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}

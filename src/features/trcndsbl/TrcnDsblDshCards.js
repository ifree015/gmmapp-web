import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
import ShadowCard from '@components/ShadowCard';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import DepartureBoardOutlinedIcon from '@mui/icons-material/DepartureBoardOutlined';
import RunCircleOutlinedIcon from '@mui/icons-material/RunCircleOutlined';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import { useSpring, animated } from '@react-spring/web';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useUser from '@common/hooks/useUser';
import nativeApp from '@common/utils/nativeApp';
import { CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip);

const labels = Array.from({ length: 4 }, (v, index) =>
  dayjs()
    .subtract(3 - index, 'day')
    .format('MM.DD')
);

const AnimatedTypography = animated(Typography);

export default function TrcnDsblDshCards({ trcnDsbl }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useUser();

  const trcnDsblItems = [
    {
      category: CENT_TRCN_DSBL_CATEGORY.AGN_ACPT_WAIT,
      cnt: trcnDsbl.agnAcptWaitNcnt,
      color: 'info.main',
      bgcolor: 'info.light',
      icon: <AssignmentIndOutlinedIcon />,
      shortTitlable: true,
      animation: useSpring({
        from: { count: 0 },
        count: trcnDsbl.agnAcptWaitNcnt,
        delay: 200,
      }),
    },
    {
      category: CENT_TRCN_DSBL_CATEGORY.PIC_UPRO,
      cnt: trcnDsbl.picUproNcnt,
      color: user.isCenterUser() ? 'info.main' : 'text.secondary',
      bgcolor: 'info.light',
      icon: <DirectionsRunOutlinedIcon />,
      shortTitlable: true,
      animation: useSpring({
        from: { count: 0 },
        count: trcnDsbl.picUproNcnt,
        delay: 200,
      }),
    },
    {
      category: CENT_TRCN_DSBL_CATEGORY.CENT_ALL,
      cnt: trcnDsbl.centNcnt,
      color: 'info.main',
      bgcolor: 'info.light',
      icon: <DepartureBoardOutlinedIcon />,
      shortTitlable: false,
      animation: useSpring({
        from: { count: 0 },
        count: trcnDsbl.centNcnt,
        delay: 200,
      }),
      chart: {
        labels,
        datasets: [
          {
            label: '장애 건',
            data: trcnDsbl.ddTrcnDsblNcnts.map((ddTrcnDsbl) => ddTrcnDsbl.ncnt),
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.secondary.light
                : theme.palette.secondary.dark,
          },
        ],
      },
    },
    {
      category: CENT_TRCN_DSBL_CATEGORY.CENT_UPRO,
      cnt: trcnDsbl.centUproNcnt,
      color: 'info.main',
      bgcolor: 'info.light',
      icon: <RunCircleOutlinedIcon />,
      shortTitlable: false,
      animation: useSpring({
        from: { count: 0 },
        count: trcnDsbl.centUproNcnt,
        delay: 200,
      }),
      chart: {
        labels,
        datasets: [
          {
            label: '미처리 건',
            data: trcnDsbl.ddTrcnDsblNcnts.map((ddTrcnDsbl) => ddTrcnDsbl.uproNcnt),
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.secondary.light
                : theme.palette.secondary.dark,
          },
        ],
      },
    },
    {
      category: CENT_TRCN_DSBL_CATEGORY.CENT_PRCG_FN,
      cnt: trcnDsbl.centPrcgNcnt,
      color: 'text.secondary',
      bgcolor: 'info.light',
      icon: <DirectionsBusOutlinedIcon />,
      shortTitlable: true,
    },
    {
      category: CENT_TRCN_DSBL_CATEGORY.PIC_PRCG_FN,
      cnt: trcnDsbl.picPrcgNcnt,
      color: 'text.secondary',
      bgcolor: 'info.light',
      icon: <EmojiPeopleOutlinedIcon />,
      shortTitlable: true,
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  const handleCentTrcnDsbl = (categoryId) => {
    const queryParams = {
      categoryId: categoryId,
      dsblAcptDt: dayjs().format('YYYYMMDD'),
      dprtId: user.isCenterUser() ? user.dprtId : '',
      dsblPrcgPicId: user.isCenterUser() ? user.userId : '',
    };
    if ([CENT_TRCN_DSBL_CATEGORY.AGN_ACPT_WAIT.id].includes(categoryId)) {
      queryParams.dprtId = '';
    }

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
    <Box>
      <Grid container spacing={2}>
        {trcnDsblItems.map((trcnDsblItem, index) => (
          <Grid
            item
            xs={trcnDsblItem.chart ? 12 : 6}
            sm={trcnDsblItem.chart ? 12 : 6}
            key={trcnDsblItem.category.id}
          >
            <ShadowCard>
              <CardActionArea
                onClick={() => handleCentTrcnDsbl(trcnDsblItem.category.id)}
                disabled={
                  !user.isCenterUser() &&
                  [
                    CENT_TRCN_DSBL_CATEGORY.PIC_UPRO.id,
                    CENT_TRCN_DSBL_CATEGORY.PIC_PRCG_FN.id,
                  ].includes(trcnDsblItem.category.id)
                }
              >
                <CardHeader
                  title={
                    trcnDsblItem.shortTitlable
                      ? trcnDsblItem.category.shortTitle
                      : trcnDsblItem.category.title
                  }
                  titleTypographyProps={{
                    align: 'left',
                    variant: 'subtitle1',
                    fontSize: 'h6.fontSize',
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                    color: 'text.secondary',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[300]
                        : theme.palette.grey[700],
                  }}
                  avatar={
                    <Avatar sx={{ width: 32, height: 32, bgcolor: trcnDsblItem.bgcolor }}>
                      {trcnDsblItem.icon}
                    </Avatar>
                  }
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: trcnDsblItem.chart ? 'space-between' : 'center',
                    alignItems: 'center',
                  }}
                >
                  {trcnDsblItem.chart ? (
                    <Paper
                      sx={{
                        height: 120,
                        p: 1,
                      }}
                    >
                      <Bar
                        options={chartOptions}
                        data={trcnDsblItem.chart}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      />
                    </Paper>
                  ) : null}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: trcnDsblItem.chart ? 'flex-end' : 'center',
                      alignItems: 'center',
                      minWidth: trcnDsblItem.chart ? 96 : 'auto',
                    }}
                  >
                    {trcnDsblItem.animation ? (
                      <AnimatedTypography
                        component="h4"
                        variant="h4"
                        color={trcnDsblItem.color}
                        style={trcnDsblItem.animation}
                      >
                        {trcnDsblItem.animation.count.to((c) => c.toFixed())}
                      </AnimatedTypography>
                    ) : (
                      <Typography component="h4" variant="h4" color={trcnDsblItem.color}>
                        {trcnDsblItem.cnt}
                      </Typography>
                    )}
                    <Typography variant="h6" color="text.secondary">
                      &nbsp;건
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </ShadowCard>
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          sm={12}
          sx={{
            'display': 'flex',
            'justifyContent': 'flex-end',
            '&.MuiGrid-item': { pt: 1 },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            <strong>접수 일자:</strong> 3전일 ~ 금일
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

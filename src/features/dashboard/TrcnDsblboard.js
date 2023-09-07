import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import DepartureBoardOutlinedIcon from '@mui/icons-material/DepartureBoardOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import Fade from '@mui/material/Fade';
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
import { useQuery } from '@common/queries/query';
import useAuth from '@common/hooks/useAuth';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import { USER_ROLE, CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import { fetchTrcnDsblNcnt, fetchCentTrcnDsblNcnt } from '@features/trcndsbl/trcnDsblAPI';
import nativeApp from '@common/utils/nativeApp';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip);

const labels = Array.from({ length: 4 }, (v, index) =>
  dayjs()
    .subtract(3 - index, 'day')
    .format('MM.DD')
);

const AnimatedTypography = animated(Typography);

export default function TrcnDsblboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const auth = useAuth();
  const user = useUser();
  const userRole = useRole();
  const queryParams = {
    dsblAcptDt: dayjs().format('YYYYMMDD'),
    dprtId: userRole === USER_ROLE.SELECTOR ? '' : user.dprtId,
    dsblPrcgPicId: user.userId,
    dsblPrsrName: user.userNm,
    dsblPrcgDt: dayjs().format('YYYYMMDD'),
    // new Date().getHours() < 4
    //   ? dayjs().subtract(1, 'day').format('YYYYMMDD')
    //   : dayjs().format('YYYYMMDD'),
  };
  const { data, refetch } = useQuery(['readTrcnDsblNcnt'], () => fetchTrcnDsblNcnt(queryParams), {
    enabled: false,
    suspense: false,
    select: ({ data }) => {
      return [
        {
          category: CENT_TRCN_DSBL_CATEGORY.CENT_ALL,
          cnt: data.allNcnt,
          bgcolor: 'info.light',
          icon: <DirectionsBusOutlinedIcon />,
          color: 'text.secondary',
          shortTitle: false,
          animation: true,
          chart: true,
        },
        {
          category: CENT_TRCN_DSBL_CATEGORY.CENT_UPRO,
          cnt: data.centUproNcnt,
          bgcolor: 'info.light',
          icon: <DepartureBoardOutlinedIcon />,
          color: 'primary.main',
          shortTitle: false,
          animation: true,
          chart: true,
        },
        {
          category: CENT_TRCN_DSBL_CATEGORY.UPRO,
          cnt: data.uproNcnt,
          bgcolor: 'info.light',
          icon: <DirectionsRunOutlinedIcon />,
          color: 'primary.main',
          shortTitle: false,
          animation: false,
          chart: false,
        },
        {
          category: CENT_TRCN_DSBL_CATEGORY.PRCG_FN,
          cnt: data.prcgNcnt,
          bgcolor: 'info.light',
          icon: <EmojiPeopleOutlinedIcon />,
          color: 'text.secondary',
          shortTitle: true,
          animation: false,
          chart: false,
        },
      ];
    },
  });
  const { data: centTrcnDsblNcnt, refetch: refetch2 } = useQuery(
    ['readCentTrcnDsblNcnt'],
    () => fetchCentTrcnDsblNcnt(queryParams),
    {
      enabled: false,
      suspense: false,
    }
  );

  useEffect(() => {
    if (auth) {
      refetch();
      refetch2();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const handleCard = (categoryId) => {
    queryParams.categoryId = categoryId;
    if (nativeApp.isIOS()) {
      queryParams.backButton = 'Y';
      queryParams.appBarHidden = 'Y';
      nativeApp.pushView('/centtrcndsbl?' + new URLSearchParams(queryParams).toString(), {
        title: '센터 단말기장애',
      });
    } else {
      navigate('/centtrcndsbl?' + new URLSearchParams(queryParams).toString(), {
        state: { from: location.pathname },
      });
    }
  };

  const chartDatas = [
    {
      labels,
      datasets: [
        {
          label: '장애 건',
          data:
            centTrcnDsblNcnt?.data?.map((dayCentTrcnDsblNcnt) => dayCentTrcnDsblNcnt.ncnt) ?? [],
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.secondary.light
              : theme.palette.secondary.dark,
        },
      ],
    },
    {
      labels,
      datasets: [
        {
          label: '미처리 건',
          data:
            centTrcnDsblNcnt?.data?.map((dayCentTrcnDsblNcnt) => dayCentTrcnDsblNcnt.uproNcnt) ??
            [],
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.secondary.light
              : theme.palette.secondary.dark,
        },
      ],
    },
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

  const countProps = [
    useSpring({
      from: { count: 0 },
      count: data ? data[0].cnt : 0,
      delay: 200,
    }),
    useSpring({
      from: { count: 0 },
      count: data ? data[1].cnt : 0,
      delay: 200,
    }),
  ];

  return (
    <Fade in={true}>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {(data
            ? data
            : Array.from({ length: 4 }, (v, i) => ({ chart: i < 2 ? true : false }))
          ).map((item, index) => (
            <Grid item xs={item.chart ? 12 : 6} sm={item.chart ? 12 : 6} key={index}>
              <Card>
                <CardActionArea
                  onClick={() => handleCard(item.category?.id)}
                  disabled={
                    userRole === USER_ROLE.SELECTOR &&
                    [CENT_TRCN_DSBL_CATEGORY.UPRO.id, CENT_TRCN_DSBL_CATEGORY.PRCG_FN.id].includes(
                      item.category?.id
                    )
                  }
                >
                  <CardHeader
                    title={item.shortTitle ? item.category?.shortTitle : item.category?.title}
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
                          ? theme.palette.grey[200]
                          : theme.palette.grey[700],
                    }}
                    avatar={
                      <Avatar sx={{ width: 32, height: 32, bgcolor: item.bgcolor }}>
                        {item.icon}
                      </Avatar>
                    }
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: item.chart ? 'flex-start' : 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.chart ? (
                      <Paper
                        sx={{
                          height: 120,
                          width: `calc(100% - 92px)`,
                          p: 1,
                        }}
                      >
                        <Bar
                          options={options}
                          data={chartDatas[index]}
                          onClick={(event) => event.stopPropagation()}
                        />
                      </Paper>
                    ) : null}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: item.chart ? 'flex-end' : 'center',
                        alignItems: 'baseline',
                        width: item.chart ? 92 : 'auto',
                      }}
                    >
                      {item.animation ? (
                        <AnimatedTypography
                          component="h5"
                          variant="h4"
                          color={item.color}
                          style={countProps[index]}
                        >
                          {countProps[index].count.to((c) => c.toFixed())}
                        </AnimatedTypography>
                      ) : (
                        <Typography component="h2" variant="h4" color={item.color}>
                          {item.cnt}
                        </Typography>
                      )}
                      <Typography variant="h6" color="text.secondary">
                        &nbsp;건
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography
          variant="caption"
          color="text.secondary"
          align="right"
          sx={{ mt: 1, display: 'block' }}
        >
          <strong>미처리:</strong> 3전일 ~ 금일, <strong>처리완료:</strong> 금일
        </Typography>
      </Box>
    </Fade>
  );
}

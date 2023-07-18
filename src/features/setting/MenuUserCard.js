import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import dayjs from 'dayjs';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
//   Title,
// } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useQuery } from '@common/queries/query';
import { fetchTrcnDsblPrcgNcnt, fetchWeekTrcnDsblPrcgNcnt } from '@features/trcndsbl/trcnDsblAPI';
import { USER_ROLE } from '@common/constants/appConstants';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip);

const labels = Array.from({ length: 7 }, (v, index) =>
  dayjs()
    .subtract(6 - index, 'day')
    .format('MM.DD')
);

export default function MenuUserCard({ onParentClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useUser();
  const userRole = useRole();

  const queryParams = {
    dsblAcptDt: dayjs().format('YYYYMMDD'),
    dsblPrcgDt: dayjs().format('YYYYMMDD'),
    dsblPrsrName: userRole === USER_ROLE.SELECTOR ? '' : user.userNm,
  };
  const { data: trcnDsblPrcgNcnt } = useQuery(
    ['readTrcnDsblPrcgNcnt'],
    () => fetchTrcnDsblPrcgNcnt(queryParams),
    {
      suspense: false,
    }
  );
  const { data: weekData } = useQuery(
    ['readWeekTrcnDsblPrcgNcnt'],
    () => fetchWeekTrcnDsblPrcgNcnt(queryParams),
    {
      suspense: false,
      select: ({ data }) => {
        return data.map((dayTrcnDsblPrcgNcnt) => dayTrcnDsblPrcgNcnt.cnt);
      },
    }
  );

  const handleLink = useCallback(
    (linkType) => {
      const isTrcndsbl = location.pathname === '/trcndsbl';
      if (isTrcndsbl) {
        onParentClose();
      }

      if (linkType === 'month') {
        navigate(
          `/trcndsbl?dsblAcptSttDt=${dayjs()
            .subtract(1, 'month')
            .subtract(3, 'day')
            .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format(
            'YYYYMMDD'
          )}&dsblPrcgFnYn=Y&dsblPrcgSttDt=${dayjs()
            .subtract(1, 'month')
            .format('YYYYMMDD')}&dsblPrcgEndDt=${dayjs().format('YYYYMMDD')}&dsblPrsrName=${
            userRole === USER_ROLE.SELECTOR ? '' : user.userNm
          }`,
          {
            replace: isTrcndsbl,
            state: { from: isTrcndsbl ? location.state?.from : location.pathname },
          }
        );
      } else {
        navigate(
          `/trcndsbl?dsblAcptSttDt=${dayjs()
            .subtract(6 + 3, 'day')
            .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format(
            'YYYYMMDD'
          )}&dsblPrcgFnYn=Y&dsblPrcgSttDt=${dayjs()
            .subtract(6, 'day')
            .format('YYYYMMDD')}&dsblPrcgEndDt=${dayjs().format('YYYYMMDD')}&dsblPrsrName=${
            userRole === USER_ROLE.SELECTOR ? '' : user.userNm
          }`,
          {
            replace: isTrcndsbl,
            state: { from: isTrcndsbl ? location.state?.from : location.pathname },
          }
        );
      }
    },
    [navigate, userRole, user.userNm, location, onParentClose]
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: '처리 건',
        data: weekData,
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.secondary.light
            : theme.palette.secondary.dark,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '단말기 장애 주 처리 건',
        color: theme.palette.text.secondary,
      },
      legend: {
        display: false,
        position: 'bottom',
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

  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardHeader
          sx={{ py: 1 }}
          avatar={
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
              }}
              aria-label="employee"
            >
              {userRole.substring(0, 1)}
            </Avatar>
          }
          title={`${user.userId}(${user.userNm})`}
          subheader={userRole}
          titleTypographyProps={{
            variant: 'sutitle1',
            fontWeight: 600,
            color: 'primary',
          }}
        ></CardHeader>
        <CardContent>
          <Typography variant="body1" align="center" color="text.secondary" noWrap>
            <strong>지역: </strong>
            {user.intgAstsBzDvsNm}, <strong>부서: </strong>
            {user.dprtNm}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'info.light' : 'info.dark'),
            color: theme.palette.text.secondary2,
            display: 'flex',
            // justifyContent: 'space-between',
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ mr: 'auto' }} />
          <Typography>
            달 처리:&nbsp;
            <Link
              underline="none"
              color="inherit"
              onClick={() => handleLink('month')}
              component="button"
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
              // component={RouterLink}
              // to={`/trcndsbl?dsblAcptSttDt=${dayjs()
              //   .subtract(1, 'month')
              //   .subtract(3, 'day')
              //   .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format(
              //   'YYYYMMDD'
              // )}&dsblPrcgFnYn=Y&dsblPrcgSttDt=${dayjs()
              //   .subtract(1, 'month')
              //   .format('YYYYMMDD')}&dsblPrcgEndDt=${dayjs().format('YYYYMMDD')}&dsblPrsrName=${
              //   user.userNm
              // }`}
            >
              {new Intl.NumberFormat().format(trcnDsblPrcgNcnt?.data.monNcnt ?? 0)}
            </Link>
            &nbsp;건, 주 처리:&nbsp;
            <Link
              underline="none"
              color="inherit"
              onClick={() => handleLink('week')}
              component="button"
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
              // component={RouterLink}
              // to={`/trcndsbl?dsblAcptSttDt=${dayjs()
              //   .subtract(6 + 3, 'day')
              //   .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format(
              //   'YYYYMMDD'
              // )}&dsblPrcgFnYn=Y&dsblPrcgSttDt=${dayjs()
              //   .subtract(6, 'day')
              //   .format('YYYYMMDD')}&dsblPrcgEndDt=${dayjs().format('YYYYMMDD')}&dsblPrsrName=${
              //   user.userNm
              // }`}
            >
              {new Intl.NumberFormat().format(trcnDsblPrcgNcnt?.data.weekNcnt ?? 0)}
            </Link>
            &nbsp;건
          </Typography>
        </CardActions>
      </Card>
      <Paper
        sx={{
          mt: 1,
          height: 160,
          p: 1,
        }}
      >
        <Bar options={options} data={chartData} />
      </Paper>
      {/* <Typography
        variant="caption"
        color="text.secondary"
        align="right"
        sx={{ mt: 1, display: 'block' }}
      >
        접수일자 기준
      </Typography> */}
    </Box>
  );
}

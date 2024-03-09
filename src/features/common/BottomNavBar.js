import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import Box from '@mui/material/Box';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import nativeApp from '@common/utils/nativeApp';
// import dayjs from 'dayjs';
// import useUser from '@common/hooks/useUser';

const NavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  '&.Mui-selected': { color: theme.palette.secondary.main },
  // '& .MuiBottomNavigationAction-label': {
  //   fontWeight: theme.typography.fontWeightBold,
  // },
}));

export default function BottomNavBar({ currentNav }) {
  const location = useLocation();
  const navigate = useNavigate();
  // const user = useUser();

  const handleClick = (navValue) => {
    if (location.pathname === navValue) return;

    let queryParams = null;
    // switch (navValue) {
    //   case '/trcndsbl/trcndsbl':
    //     queryParams = {
    //       dsblAcptDtDvs: '3month',
    //       dsblAcptSttDt: dayjs().subtract(3, 'month').format('YYYYMMDD'),
    //       dsblAcptEndDt: dayjs().format('YYYYMMDD'),
    //       dprtId: user.isCenterUser() ? user.dprtId : '',
    //       dprtNm: user.isCenterUser() ? user.dprtNm : '',
    //     };
    //     break;
    //   default:
    //     queryParams = null;
    // }

    navigate(navValue + (queryParams ? `?${new URLSearchParams(queryParams).toString()}` : ''), {
      state: { from: location.pathname },
    });
  };

  return (
    <React.Fragment>
      {!nativeApp.isIOS() ? (
        <React.Fragment>
          <Toolbar />
          <Paper
            sx={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
            }}
            elevation={3}
          >
            <BottomNavigation
              showLabels
              value={currentNav}
              onChange={(event, newValue) => {
                handleClick(newValue);
              }}
            >
              <NavigationAction
                label="차량"
                value="/baseinf/vhcl"
                icon={<DirectionsBusFilledOutlinedIcon color="inherit" />}
              />
              <NavigationAction
                label="단말기"
                value="/trcnprcn/trcnloc"
                icon={<DashboardOutlinedIcon color="inherit" />}
              />
              <NavigationAction
                label="Home"
                value="/"
                color="secondary"
                icon={<HomeOutlinedIcon />}
              />
              <NavigationAction
                label="센터"
                value="/trcndsbl/centtrcndsbl"
                icon={<PeopleOutlinedIcon />}
              />
              <NavigationAction
                label="승인"
                value="/wrkflw/trcndsblaprv"
                icon={<FactCheckOutlinedIcon color="inherit" />}
              />
            </BottomNavigation>
          </Paper>
        </React.Fragment>
      ) : // <Toolbar
      //   sx={{
      //     minHeight: 'env(safe-area-inset-bottom)',
      //     height: 'env(safe-area-inset-bottom)',
      //   }}
      // />
      null}
    </React.Fragment>
  );
}

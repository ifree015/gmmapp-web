import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import nativeApp from '@common/utils/nativeApp';
import dayjs from 'dayjs';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import { USER_ROLE, CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';

const NavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  '&.Mui-selected': { color: theme.palette.secondary.main },
  // '& .MuiBottomNavigationAction-label': {
  //   fontWeight: theme.typography.fontWeightBold,
  // },
}));

export default function BottomNavBar({ currentNav }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const userRole = useRole();

  const handleClick = (navValue) => {
    if (location.pathname === navValue) return;

    let queryParams = null;
    switch (navValue) {
      case '/centtrcndsbl':
        queryParams = {
          categoryId: CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
          dsblAcptDt: dayjs().format('YYYYMMDD'),
          dprtId: userRole === USER_ROLE.SELECTOR ? '' : user.dprtId,
          dsblPrcgPicId: user.userId,
          dsblPrsrName: user.userNm,
          dsblPrcgDt: dayjs().format('YYYYMMDD'),
        };
        break;
      case '/trcndsbl':
        queryParams = {
          dsblAcptDtDvs: '3month',
          dsblAcptSttDt: dayjs().subtract(3, 'month').format('YYYYMMDD'),
          dsblAcptEndDt: dayjs().format('YYYYMMDD'),
          dprtId: user.trcnDsblCentYn === 'Y' ? user.dprtId : '',
          dprtNm: user.trcnDsblCentYn === 'Y' ? user.dprtNm : '',
        };
        break;
      default:
        queryParams = null;
    }

    navigate(navValue + (queryParams ? `?${new URLSearchParams(queryParams).toString()}` : ''), {
      state: { from: location.pathname },
    });
  };

  return (
    <React.Fragment>
      {!nativeApp.isIOS() ? (
        <React.Fragment>
          <Toolbar variant="dense" />
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
                label="센터"
                value="/centtrcndsbl"
                icon={<PeopleIcon color="inherit" />}
              />
              <NavigationAction label="Home" value="/" color="secondary" icon={<HomeIcon />} />
              <NavigationAction label="장애" value="/trcndsbl" icon={<BusAlertIcon />} />
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

import React, { useEffect, useReducer, useCallback } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import produce from 'immer';
// import dayjs from 'dayjs';
import TrcnDsblVhclSearchDialog from '@features/search/TrcnDsblVhclSearchDialog';
import { useQuery } from '@common/queries/query';
import { fetchNewNtfcPtNcnt } from '@features/notification/notificationAPI';
import NotificationDialog from '@features/notification/NotificationDialog';
import AppMenuDialog from '@features/setting/AppMenuDialog';
import useAuth from '@common/hooks/useAuth';
import ElevationScroll from '@components/ElevationScroll';
import nativeApp from '@common/utils/nativeApp';

const SearchButton = styled(Button)(({ theme }) => {
  return {
    'color': alpha(theme.palette.common.white, 0.5),
    'textTransform': 'none',
    'backgroundColor': alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    'justifyContent': 'flex-start',
    //'flexGrow': 1,
    'marginLeft': 'auto',
    'padding': theme.spacing(0.5, 3, 0.5, 1),
    'marginRight': theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      //flexGrow: 0,
      //marginLeft: 'auto',
      paddingRight: theme.spacing(8),
    },
  };
});

const initialState = {
  search: false,
  notification: false,
  menu: false,
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'SEARCH_OPEN':
        draft.search = true;
        break;
      case 'SEARCH_CLOSE':
        draft.search = false;
        break;
      case 'NOTIFICATION_OPEN':
        draft.notification = true;
        break;
      case 'NOTIFICATION_CLOSE':
        draft.notification = false;
        break;
      case 'MENU_OPEN':
        draft.menu = true;
        break;
      case 'MENU_CLOSE':
        draft.menu = false;
        break;
      default:
        return draft;
    }
  });
}

export default function SubAppBarWrapper({
  elevationScroll = true,
  backToTop = false,
  elevation = 1,
  spaceHeight = 0,
}) {
  return !nativeApp.isIOS() ? (
    <React.Fragment>
      {elevationScroll ? (
        <ElevationScroll>
          <MainAppBar elevation={elevation} />
        </ElevationScroll>
      ) : (
        <MainAppBar elevation={elevation} />
      )}
      <Toolbar id={backToTop ? 'back-to-top-anchor' : ''} variant="dense" />
    </React.Fragment>
  ) : (
    <Toolbar
      id={backToTop ? 'back-to-top-anchor' : ''}
      sx={{
        minHeight: spaceHeight,
        height: spaceHeight,
        backgroundColor: (theme) => theme.palette.background.color,
      }}
    />
  );
}

function MainAppBar({ elevation }) {
  const auth = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data, remove } = useQuery(
    ['fetchNewNtfcPtNcnt'],
    () =>
      fetchNewNtfcPtNcnt({
        // ntfcDsptDt: dayjs().subtract(1, 'month').format('YYYYMMDD')
      }),
    {
      enabled: auth,
      suspense: false,
      useErrorBoundary: false,
      refetchOnWindowFocus: true,
      refetchInterval: 3 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (!auth) {
      remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const closeSearch = useCallback(() => {
    dispatch({
      type: 'SEARCH_CLOSE',
    });
  }, []);

  const closeNotification = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CLOSE',
    });
  }, []);

  const closeMenu = useCallback(() => {
    dispatch({
      type: 'MENU_CLOSE',
    });
  }, []);

  return (
    <AppBar
      position="fixed"
      color="secondary"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'secondary.main' : theme.palette.background.paper2,
      }}
      elevation={elevation}
      // sx={{ maxWidth: 'sm', left: '50%', transform: 'translateX(-50%)' }}
    >
      <Toolbar variant="dense">
        <Typography component="h1" variant="h6" noWrap sx={{ mr: 3 }}>
          Home
        </Typography>
        <SearchButton
          startIcon={<SearchOutlinedIcon color="inherit" />}
          onClick={() =>
            dispatch({
              type: 'SEARCH_OPEN',
            })
          }
        >
          Search...
        </SearchButton>
        <IconButton
          color="inherit"
          onClick={() =>
            dispatch({
              type: 'NOTIFICATION_OPEN',
            })
          }
        >
          <Badge badgeContent={data?.data.newNtfcNcnt ?? 0} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="menu"
          edge="end"
          onClick={() =>
            dispatch({
              type: 'MENU_OPEN',
            })
          }
        >
          <MenuOutlinedIcon />
        </IconButton>
      </Toolbar>
      <TrcnDsblVhclSearchDialog open={state.search} onClose={closeSearch} />
      <NotificationDialog open={state.notification} onClose={closeNotification} />
      <AppMenuDialog open={state.menu} onClose={closeMenu} />
    </AppBar>
  );
}

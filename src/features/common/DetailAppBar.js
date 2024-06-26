import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Typography from '@mui/material/Typography';
// import Badge from '@mui/material/Badge';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

import HideOnScroll from '@components/HideOnScroll';
import ElevationScroll from '@components/ElevationScroll';
import nativeApp from '@common/utils/nativeApp';

const DetailAppBarWrapper = ({
  hideOnScroll = false,
  threshold = 40,
  elevationScroll = true,
  backToTop = false,
  title,
  position = 'relative',
  spaceHeight = 2,
  elevation = 1,
}) => {
  return !nativeApp.isIOS() ? (
    <React.Fragment>
      {hideOnScroll ? (
        <HideOnScroll threshold={threshold}>
          <DetailAppBar title={title} elevation={elevation} position={position} />
        </HideOnScroll>
      ) : elevationScroll ? (
        <ElevationScroll>
          <DetailAppBar title={title} elevation={elevation} position={position} />
        </ElevationScroll>
      ) : (
        <DetailAppBar title={title} elevation={elevation} position={position} />
      )}
      {position === 'fixed' ? (
        <Toolbar id={backToTop ? 'back-to-top-anchor' : ''} variant="dense" />
      ) : null}
    </React.Fragment>
  ) : (
    <Toolbar
      id={backToTop ? 'back-to-top-anchor' : ''}
      // TODO('여백을 안 주면 stick header가 바로 적용')
      sx={{
        minHeight: spaceHeight,
        height: spaceHeight,
        backgroundColor: (theme) => theme.palette.background.color,
      }}
    />
  );
};

function DetailAppBar({ title, elevation, position }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppBar
      position={position}
      color="secondary"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'secondary.main' : theme.palette.background.paper2,
      }}
      // sx={{ maxWidth: 'sm', left: '50%', transform: 'translateX(-50%)' }}
      elevation={elevation}
    >
      <Toolbar variant="dense">
        <IconButton
          color="inherit"
          onClick={() => {
            if (location.state?.from) {
              navigate(-1);
            } else {
              navigate('/', { replace: true });
            }
          }}
          edge="start"
        >
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          align="center"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        {/* <IconButton color="inherit">
          <Badge badgeContent={0} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton> */}
        {/* <IconButton size="large" color="inherit" aria-label="search">
          <SearchOutlinedIcon />
        </IconButton>
        <IconButton size="large" color="inherit" aria-label="menu" edge="end">
          <MenuOutlinedIcon />
        </IconButton> */}
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(DetailAppBarWrapper);

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Typography from '@mui/material/Typography';
import ElevationScroll from '@components/ElevationScroll';
import nativeApp from '@common/utils/nativeApp';

const SubAppBarWrapper = ({
  elevationScroll = true,
  backToTop = true,
  title,
  elevation = 1,
  spaceHeight = 0,
  children,
}) => {
  return !nativeApp.isIOS() ? (
    <React.Fragment>
      {elevationScroll ? (
        <ElevationScroll>
          <SubAppBar title={title} elevation={elevation}>
            {children}
          </SubAppBar>
        </ElevationScroll>
      ) : (
        <SubAppBar title={title} elevation={elevation}>
          {children}
        </SubAppBar>
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
};

function SubAppBar({ title, elevation, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <AppBar
      position="fixed"
      color="secondary"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'secondary.main' : theme.palette.background.paper2,
      }}
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
        {children}
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(SubAppBarWrapper);

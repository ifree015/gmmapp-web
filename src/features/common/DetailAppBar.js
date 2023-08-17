import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
// import Badge from '@mui/material/Badge';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const DetailAppBar = ({ title, elevation = 1 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppBar
      position="relative"
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
          <ArrowBackIcon />
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
};

export default React.memo(DetailAppBar);

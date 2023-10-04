import React, { useReducer, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
// import Badge from '@mui/material/Badge';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import produce from 'immer';
import TrcnDsblVhclSearchDialog from '@features/search/TrcnDsblVhclSearchDialog';
import AppMenuDialog from '@features/setting/AppMenuDialog';

const initialState = {
  search: false,
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

const SubAppBar = ({ title, search = false, elevation = 1 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const closeSearch = useCallback(() => {
    dispatch({
      type: 'SEARCH_CLOSE',
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
        {searchParams.get('backButton') === 'Y' ? (
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
        ) : null}
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
        <IconButton
          color="inherit"
          aria-label="search"
          onClick={() =>
            dispatch({
              type: 'SEARCH_OPEN',
            })
          }
          sx={{ display: search ? 'inline-flex' : 'none' }}
        >
          <SearchOutlinedIcon />
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
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <TrcnDsblVhclSearchDialog open={state.search} onClose={closeSearch} />
      <AppMenuDialog open={state.menu} onClose={closeMenu} />
    </AppBar>
  );
};

export default React.memo(SubAppBar);

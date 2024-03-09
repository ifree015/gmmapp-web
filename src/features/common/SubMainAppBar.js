import React, { useReducer, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Typography from '@mui/material/Typography';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import produce from 'immer';
// import TrcnDsblVhclSearchDialog from '@features/search/TrcnDsblVhclSearchDialog';
import AppMenuDialog from '@features/setting/AppMenuDialog';
import ElevationScroll from '@components/ElevationScroll';
import nativeApp from '@common/utils/nativeApp';

const initialState = {
  search: false,
  menu: false,
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      // case 'SEARCH_OPEN':
      //   draft.search = true;
      //   break;
      // case 'SEARCH_CLOSE':
      //   draft.search = false;
      // break;
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

const SubMainAppBarWrapper = ({
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
          <SubMainAppBar title={title} elevation={elevation}>
            {children}
          </SubMainAppBar>
        </ElevationScroll>
      ) : (
        <SubMainAppBar title={title} elevation={elevation}>
          {children}
        </SubMainAppBar>
      )}
      <Toolbar id={backToTop ? 'back-to-top-anchor' : ''} variant="dense" />
    </React.Fragment>
  ) : (
    // TODO('여백을 안 주면 stick header가 바로 적용')
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

function SubMainAppBar({ title, elevation, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // const closeSearch = useCallback(() => {
  //   dispatch({
  //     type: 'SEARCH_CLOSE',
  //   });
  // }, []);

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
    >
      <Toolbar variant="dense">
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
        {/* <IconButton
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
        </IconButton> */}
        {children}
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
      {/* <TrcnDsblVhclSearchDialog open={state.search} onClose={closeSearch} /> */}
      <AppMenuDialog open={state.menu} onClose={closeMenu} />
    </AppBar>
  );
}
export default React.memo(SubMainAppBarWrapper);

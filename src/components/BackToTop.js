// import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import nativeApp from '@common/utils/nativeApp';

export function ScrollTop({ children, bottom }) {
  // const [visible, setVisible] = useState(false);
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    //target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // const handleScroll = useCallback((event) => {
  //   clearTimeout(window.scrollEndTimer);
  //   setVisible(false);
  //   window.scrollEndTimer = setTimeout(() => {
  //     setVisible(true);
  //   }, 100);
  // }, []);

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [handleScroll]);

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: bottom,
          right: 16,
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export default function BackToTop({ bottomNavBar = false, bottomToolBar = false, bottom }) {
  if (!bottom) {
    if (bottomNavBar) {
      bottom = nativeApp.isIOS() ? 'calc(env(safe-area-inset-bottom) + 16px)' : 'calc(56px + 16px)';
    } else if (bottomToolBar) {
      bottom = nativeApp.isIOS()
        ? 'calc(env(safe-area-inset-bottom) + 56px + 16px)'
        : 'calc(56px + 16px)';
    } else {
      bottom = 'calc(env(safe-area-inset-bottom) + 16px)';
    }
  }

  return (
    <ScrollTop bottom={bottom}>
      <Fab size="small" aria-label="scroll back to top" color="info">
        <KeyboardArrowUpOutlinedIcon />
      </Fab>
    </ScrollTop>
  );
}

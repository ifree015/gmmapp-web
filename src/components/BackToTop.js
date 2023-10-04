// import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';

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
    console.log('event' + event);
    const anchor = (event.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
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

export default function BackToTop({ bottom = '16px' }) {
  return (
    <ScrollTop bottom={bottom}>
      <Fab size="small" aria-label="scroll back to top" color="info">
        <KeyboardArrowUpIcon />
      </Fab>
    </ScrollTop>
  );
}

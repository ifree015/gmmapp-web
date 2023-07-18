import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';

export function ScrollTop({ children, bottom }) {
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
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: `calc(env(safe-area-inset-bottom) / 2 + ${bottom})`,
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

import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';

export default function HideOnScroll({ children, threshold = 100 }) {
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshold,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <Box>{children}</Box>
    </Slide>
  );
}

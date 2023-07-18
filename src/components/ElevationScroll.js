import React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';

export default function ElevationScroll({ target, children, elevation }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: target ?? undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? elevation ?? 4 : 1,
  });
}

import React from 'react';
import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import nativeApp from '@common/utils/nativeApp';

export default function ElevationScroll({ target, children, elevation }) {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: target ?? undefined,
  });

  if (nativeApp.isIOS() && theme.palette.mode === 'dark') {
    return React.cloneElement(children, {
      elevation: trigger ? elevation ?? 1 : 0,
    });
  } else {
    return React.cloneElement(children, {
      elevation: trigger ? elevation ?? 4 : 1,
    });
  }
}

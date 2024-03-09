import { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

const ArrowPopper = styled(Popper)(({ color, theme }) => {
  return {
    'zIndex': 1,
    'maxWidth': '375px',
    'width': '100%',
    '&[data-popper-placement*="bottom"] .arrow': {
      'top': 0,
      'left': 0,
      'marginTop': '-0.9em',
      'width': '3em',
      'height': '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${
          color ? theme.palette[color].main : theme.palette.background.paper
        } transparent`,
      },
    },
    '&[data-popper-placement*="top"] .arrow': {
      'bottom': 0,
      'left': 0,
      'marginBottom': '-0.9em',
      'width': '3em',
      'height': '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${
          color ? theme.palette[color].main : theme.palette.background.paper
        } transparent transparent transparent`,
      },
    },
    '&[data-popper-placement*="right"] .arrow': {
      'left': 0,
      'marginLeft': '-0.9em',
      'height': '3em',
      'width': '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${
          color ? theme.palette[color].main : theme.palette.background.paper
        } transparent transparent`,
      },
    },
    '&[data-popper-placement*="left"] .arrow': {
      'right': 0,
      'marginRight': '-0.9em',
      'height': '3em',
      'width': '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${
          color ? theme.palette[color].main : theme.palette.background.paper
        }`,
      },
    },
  };
});

const ArrowPopperArrow = forwardRef((props, ref) => {
  return (
    <Box
      component="span"
      className="arrow"
      ref={ref}
      sx={{
        'position': 'absolute',
        'fontSize': 7,
        'width': '3em',
        'height': '3em',
        '&::before': {
          content: '""',
          margin: 'auto',
          display: 'block',
          width: 0,
          height: 0,
          borderStyle: 'solid',
        },
      }}
    />
  );
});

export { ArrowPopper as default, ArrowPopperArrow };

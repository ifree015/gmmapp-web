import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Container from '@mui/material/Container';
import TrcnDsblVhclSearchContent from './TrcnDsblVhclSearchContent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function TrcnDsblVhclSearchDialog({ open, onClose }) {
  return (
    <Dialog
      fullScreen
      open={open}
      // onClose={onClose}
      TransitionComponent={Transition}
      scroll="paper"
    >
      <Container
        disableGutters
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) => theme.palette.background.color,
          minHeight: '100vh',
        }}
      >
        <TrcnDsblVhclSearchContent onClose={onClose} />
      </Container>
    </Dialog>
  );
}

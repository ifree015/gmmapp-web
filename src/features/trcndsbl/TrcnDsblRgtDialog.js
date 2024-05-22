import React from 'react';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import TrcnDsblRgtContent from './TrcnDsblRgtContent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function TrcnDsblRgtDialog({ open, onClose }) {
  return (
    <Dialog fullScreen open={open} TransitionComponent={Transition}>
      <Container
        disableGutters
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) => theme.palette.background.color,
          minHeight: '100vh',
        }}
      >
        <TrcnDsblRgtContent open={open} onClose={onClose} />
      </Container>
    </Dialog>
  );
}

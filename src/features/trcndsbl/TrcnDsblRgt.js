import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Container from '@mui/material/Container';
// import useUser from '@common/hooks/useUser';
// import TrcnDsblVhclSearchContent from './TrcnDsblVhclSearchContent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TrcnDsblRgtDialog({ open, onClose }) {
  return (
    <Dialog fullScreen open={open} TransitionComponent={Transition} scroll="paper">
      <Container
        disableGutters
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) => theme.palette.background.color,
          minHeight: '100vh',
        }}
      >
        {/* <TrcnDsblRgtContent onClose={onClose} /> */}
      </Container>
    </Dialog>
  );
}

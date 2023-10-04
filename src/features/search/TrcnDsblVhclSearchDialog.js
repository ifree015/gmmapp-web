import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Container from '@mui/material/Container';
// import useUser from '@common/hooks/useUser';
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
        disableGutters={true}
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          minHeight: '100vh',
          // overflowY: 'auto',
        }}
      >
        <TrcnDsblVhclSearchContent onClose={onClose} />
      </Container>
    </Dialog>
  );
}

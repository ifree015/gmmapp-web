import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NotificationContent from './NotificationContent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function NotificationDialog({ open, onClose }) {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition} scroll="body">
      <AppBar
        position="fixed"
        color="secondary"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? 'secondary.main' : theme.palette.background.paper2,
        }}
      >
        <Toolbar variant="dense">
          <Typography component="h1" variant="h6" sx={{ flex: 1 }}>
            알림
          </Typography>
          <IconButton color="inherit" onClick={onClose} aria-label="close" edge="end">
            <CloseOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          minHeight: '100vh',
          // overflowY: 'auto',
        }}
      >
        <Toolbar variant="dense" />
        <NotificationContent onClose={onClose} />
      </Container>
    </Dialog>
  );
}

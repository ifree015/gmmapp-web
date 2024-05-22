import React from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Slide from '@mui/material/Slide';
import TrcnDsblSignatureContent from './TrcnDsblSignatureContent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TrcnDsblSignatureDialog({ open, onClose, trcnDsbl }) {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition} scroll="body">
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.color,
          minHeight: '100vh',
        }}
      >
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
              서명
            </Typography>
            <IconButton color="inherit" onClick={onClose} aria-label="close" edge="end">
              <CloseOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar variant="dense" />
        <Container maxWidth="sm">
          <TrcnDsblSignatureContent open={open} trcnDsbl={trcnDsbl} />
        </Container>
      </Box>
    </Dialog>
  );
}

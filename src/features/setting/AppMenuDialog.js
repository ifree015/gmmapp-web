import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AppSettingDrawer from './AppSettingDrawer';
import AppMenuContent from './AppMenuContent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function AppMenuDialog({ open, onClose }) {
  const [setting, setSetting] = useState(false);

  const closeSetting = useCallback(() => {
    setSetting(false);
  }, []);

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition} scroll="body">
      {/* <Drawer
       anchor="right"
       // ModalProps={{ fullScreen: true }}
       open={open}
       onClose={onClose}
       sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%' } }}
     > */}
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
            메뉴
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              setSetting(true);
            }}
            aria-label="setting"
          >
            <SettingsOutlinedIcon />
          </IconButton>
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
        <AppMenuContent onClose={onClose} />
      </Container>
      <AppSettingDrawer open={setting} onClose={closeSetting} />
    </Dialog>
  );
}

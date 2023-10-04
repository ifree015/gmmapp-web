import React from 'react';
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AppSettingContent from './AppSettingContent';

export default function AppSettingDrawer({ open, onClose }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
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
        <AppBar
          position="relative"
          color="secondary"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? 'secondary.main' : theme.palette.background.paper2,
          }}
        >
          <Toolbar variant="dense">
            <Typography component="h1" variant="h6" sx={{ flex: 1 }}>
              설정
            </Typography>
            <IconButton color="inherit" onClick={onClose} aria-label="close" edge="end">
              <CloseOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AppSettingContent />
      </Container>
    </Drawer>
  );
}

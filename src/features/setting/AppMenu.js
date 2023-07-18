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
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorDialog from '@components/ErrorDialog';
import Copyright from '@features/common/Copyright';
import MenuUserCard from './MenuUserCard';
import MenuMenuList from './MenuMenuList';
import MenuLogout from './MenuLogout';
import AppSetting from './AppSetting';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function AppMenu({ open, onClose }) {
  const { reset } = useQueryErrorResetBoundary();
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
        <Toolbar>
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
        <Toolbar />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
          )}
        >
          <MenuUserCard onParentClose={onClose} />
        </ErrorBoundary>
        <MenuMenuList onParentClose={onClose} />
        <MenuLogout />
        <Copyright sx={{ pt: 3 }} />
      </Container>
      <AppSetting open={setting} onClose={closeSetting} />
    </Dialog>
  );
}

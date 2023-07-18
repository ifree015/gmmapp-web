import React, { useState, useMemo, Suspense } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import dayjs from 'dayjs';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import { NOTIFICATION_CATEGORY } from '@common/constants/appConstants';
import useUser from '@common/hooks/useUser';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function Notification({ open, onClose }) {
  const [categoryId, setCategoryId] = useState(NOTIFICATION_CATEGORY.ALL.id);
  const { reset } = useQueryErrorResetBoundary();
  const user = useUser();
  const queryParams = useMemo(
    () => ({
      userId: user.userId,
      categoryId: categoryId,
      ntfcDsptDt: dayjs().subtract(1, 'month').format('YYYYMMDD'),
    }),
    [user.userId, categoryId]
  );

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
        <Toolbar>
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
        <Toolbar />
        <NotificationHeader queryParams={queryParams} changeCategoryId={setCategoryId} />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <NotificationList queryParams={queryParams} onParentClose={onClose} />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pt: 3 }} />
      </Container>
    </Dialog>
  );
}

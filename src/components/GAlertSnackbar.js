import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import { selectAlertSnackbar, closeAlertSnackbar } from '@features/common/dialogSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function GAlertSnackbar(props) {
  const { open, severity, message, isSlidable, autoHideDuration } =
    useSelector(selectAlertSnackbar);
  const dispatch = useDispatch();
  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeAlertSnackbar());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      TransitionComponent={isSlidable ? Transition : Grow}
      sx={{ mb: 'calc(env(safe-area-inset-bottom))' }}
      {...props}
    >
      <Alert severity={severity} onClose={handleClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

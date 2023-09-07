// import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { setLocalItem } from '@common/utils/storage';
import { logout } from '@features/user/userSlice';
import nativeApp from '@common/utils/nativeApp';

export default function ErrorDialog({ open, error, resetError }) {
  // const [_open, setOpen] = useState(open);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   setOpen(open);
  // }, [open]);
  const handleClose = () => {
    if (resetError) resetError();
    // setOpen(false);
    if (error?.code) {
      if ('gmm.err.003 gmm.err.004'.includes(error.code)) {
        setLocalItem('remember', false);
        dispatch(logout());
        // setSessionItem('userInfo', null);
        if (nativeApp.isIOS()) {
          nativeApp.loggedOut();
        } else {
          navigate('/login');
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ bgColor: 'transparent' }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', bgcolor: 'error.main' }}
        color={(theme) => theme.palette.common.white}
      >
        <ErrorOutlineIcon sx={{ fontSize: 22 }} />
        <Typography sx={{ ml: 1.5 }}>{error?.code}</Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ paddingTop: '1.25rem' }}>
          {error instanceof Error ? error.message : error?.toString()}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', my: 1 }}>
        <Button variant="contained" color="error" autoFocus onClick={handleClose}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

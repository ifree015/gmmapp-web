import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { removeLocalItem } from '@common/utils/storage';
import { logout } from '@features/user/userSlice';
import { selectError, closeErrorDialog } from '@features/common/dialogSlice';

export default function GErrorDialog() {
  const { open, error } = useSelector(selectError);
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(closeErrorDialog());
    if (error?.code) {
      if ('gmm.err.003 gmm.err.004'.includes(error.code)) {
        removeLocalItem('remember');
        dispatch(logout());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ bgColor: 'transparent' }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', bgcolor: 'error.main', py: 1 }}
        color={(theme) => theme.palette.common.white}
      >
        <ErrorOutlineIcon sx={{ fontSize: 22 }} />
        <Typography sx={{ ml: 1.5 }}>{error?.code}</Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ paddingTop: '1.25rem' }}>
          {error?.message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ my: 1 }}>
        <Button variant="contained" color="error" autoFocus onClick={handleClose}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

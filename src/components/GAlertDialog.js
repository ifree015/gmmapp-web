import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { selectAlert, closeAlertDialog } from '@features/common/dialogSlice';

export default function GAlertDialog() {
  const { open, message } = useSelector(selectAlert);
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(closeAlertDialog());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dialog open={open} onClose={handleClose} aria-describedby="alert-dialog-description">
      <DialogContent sx={{ minWidth: { xs: 222, sm: 300 } }}>
        <DialogContentText id="confirm-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" fullWidth onClick={handleClose}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

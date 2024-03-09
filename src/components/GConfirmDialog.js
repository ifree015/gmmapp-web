import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { selectConfirm, closeConfirmDialog } from '@features/common/dialogSlice';

export default function ConfirmDialog() {
  const { open, title, message } = useSelector(selectConfirm);
  const dispatch = useDispatch();
  const handleClose = useCallback((confirmed) => {
    dispatch(closeConfirmDialog(confirmed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{ display: 'flex', alignItems: 'center', bgcolor: 'secondary.main', py: 1 }}
        color={(theme) => theme.palette.common.white}
      >
        <HelpOutlineIcon sx={{ mr: 1 }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ paddingTop: '1.25rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => handleClose(true)}>
          확인
        </Button>
        <Button variant="contained" onClick={() => handleClose(false)} autoFocus>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

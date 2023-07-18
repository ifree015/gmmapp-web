import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function AlertDialog({ open, message, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} aria-describedby="alert-dialog-description">
      <DialogContent sx={{ minWidth: { xs: 222, sm: 300 } }}>
        <DialogContentText id="confirm-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" fullWidth autoFocus onClick={() => onClose(true)}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

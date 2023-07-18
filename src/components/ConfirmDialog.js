import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function ConfirmDialog({ open, title, message, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{ display: 'flex', alignItems: 'center', bgcolor: 'secondary.main' }}
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
        <Button variant="contained" onClick={() => onClose(true)}>
          확인
        </Button>
        <Button variant="contained" onClick={() => onClose(false)} autoFocus>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

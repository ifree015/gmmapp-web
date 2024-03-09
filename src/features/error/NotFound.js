import React from 'react';
import Stack from '@mui/material/Stack';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <SentimentVeryDissatisfiedOutlinedIcon
          color="action"
          sx={{ fontSize: 56, textAlign: 'center' }}
        />
        <Alert severity="error" sx={{ px: 5 }}>
          <AlertTitle>Warning</AlertTitle>
          <strong>Page not found!</strong>
        </Alert>
      </Stack>
    </div>
  );
}

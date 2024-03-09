import React from 'react';
import styles from './NotFound.module.css';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Alert severity="error" sx={{ py: 4, width: '80%' }}>
        <AlertTitle>Warning</AlertTitle>
        <strong>Page not found!</strong>
      </Alert>
    </div>
  );
}

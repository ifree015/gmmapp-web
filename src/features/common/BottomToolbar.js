import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
// import nativeApp from '@common/utils/nativeApp';

export default function BottomToolbar({ children, justifyContent = 'flex-end' }) {
  return (
    <React.Fragment>
      <Toolbar />
      <Paper
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
        }}
        elevation={1}
      >
        <Toolbar
          sx={{
            justifyContent: justifyContent,
          }}
        >
          {children}
        </Toolbar>
      </Paper>
    </React.Fragment>
  );
}

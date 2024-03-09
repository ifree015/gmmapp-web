import React from 'react';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function LabelListItem({ label, children, width = 100, divider = false }) {
  return (
    <React.Fragment>
      <ListItem>
        <Typography
          sx={{ display: 'inline-block', minWidth: width }}
          component="span"
          variant="body2"
          color="text.secondary"
        >
          {label}
        </Typography>
        {children}
      </ListItem>
      {divider ? <Divider component="li" /> : null}
    </React.Fragment>
  );
}

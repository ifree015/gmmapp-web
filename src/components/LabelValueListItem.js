import React, { forwardRef } from 'react';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const LabelValueListItem = forwardRef(
  ({ label, value, width = 100, divider = false, preLine = false, ...props }, ref) => {
    return (
      <React.Fragment>
        <ListItem {...props}>
          <Typography
            sx={{ display: 'inline-block', minWidth: width }}
            component="span"
            variant="body2"
            color="text.secondary"
          >
            {label}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            color="text.primary"
            sx={{ whiteSpace: preLine ? 'pre-line' : 'inherit' }}
            ref={ref}
          >
            {value}
          </Typography>
        </ListItem>
        {divider ? <Divider component="li" /> : null}
      </React.Fragment>
    );
  }
);

export default LabelValueListItem;

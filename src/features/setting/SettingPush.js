import React from 'react';
import { useDispatch } from 'react-redux';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Switch from '@mui/material/Switch';
import useUser from '@common/hooks/useUser';
import { useMutation } from '@common/queries/query';
import { setPushRcvYn } from '@features/user/userSlice';
import { updatePushRcvYn } from '@features/user/userAPI';

const SettingPush = () => {
  const user = useUser();
  const dispatch = useDispatch();

  const { mutate, reset } = useMutation(updatePushRcvYn, {
    onError: (err) => {
      reset();
    },
  });

  return (
    <List
      sx={{ mt: 3, bgcolor: 'background.paper' }}
      subheader={
        <ListSubheader>
          <Typography
            variant="subtitle1"
            sx={{
              pt: 1,
              color: 'text.secondary',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
          >
            알림
          </Typography>
        </ListSubheader>
      }
    >
      <ListItem
        secondaryAction={
          <Switch
            color="warning"
            checked={user.pushRcvYn === 'Y'}
            onChange={(event) => {
              dispatch(setPushRcvYn(event.target.checked ? 'Y' : 'N'));
              mutate({ pushRcvYn: event.target.checked ? 'Y' : 'N' });
            }}
            inputProps={{
              'aria-labelledby': 'notification-list-label-push',
            }}
          />
        }
      >
        <ListItemIcon>
          <NotificationsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="푸시알림받기" />
      </ListItem>
    </List>
  );
};

export default React.memo(SettingPush);

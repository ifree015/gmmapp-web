import React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import nativeApp from '@common/utils/nativeApp';
import useNativeCall from '@common/hooks/useNativeCall';

const SettingAppInfo = () => {
  const appInfo = useNativeCall('getAppInfo');

  return (
    <React.Fragment>
      {nativeApp.isNativeApp() ? (
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
                앱
              </Typography>
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemText primary="버전 정보" />
            <ListItemText
              primary={`${appInfo?.moappVer} (${appInfo?.moappVerCd})`}
              primaryTypographyProps={{ textAlign: 'right', variant: 'body2' }}
            />
          </ListItem>
        </List>
      ) : null}
    </React.Fragment>
  );
};

export default React.memo(SettingAppInfo);

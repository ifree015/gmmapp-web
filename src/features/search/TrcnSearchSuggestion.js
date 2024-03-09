import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Typography from '@mui/material/Typography';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { getLocalItem, setLocalItem } from '@common/utils/storage';
import nativeApp from '@common/utils/nativeApp';

const TrcnSearchSuggestion = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleListItem = useCallback(
    (srchTrcn) => {
      const storageSrchTrcns = getLocalItem('srchTrcns').filter(
        (element) => srchTrcn.trcnId !== element.trcnId
      );
      srchTrcn.date = dayjs().format('MM.DD');
      storageSrchTrcns.unshift(srchTrcn);
      if (storageSrchTrcns.length > 10) storageSrchTrcns.pop();
      setLocalItem('srchTrcns', storageSrchTrcns);
      const to = `/trcnprcn/trcn?srchKwd=${srchTrcn.trcnId}`;
      if (nativeApp.isIOS()) {
        nativeApp.pushView(to, { title: '단말기' });
      } else {
        navigate(to, { state: { from: location.pathname } });
      }
    },
    [location, navigate]
  );

  const kwds = data?.srchKwd?.split(/\s+/);
  if (kwds && kwds.length === 1) kwds.unshift('');

  return (
    <React.Fragment>
      {data?.data?.length > 0 ? (
        <List sx={{ bgcolor: 'background.paper' }}>
          {data.data.map((srchTrcn) => (
            <ListItem disablePadding key={`${srchTrcn.trcnId}`}>
              <ListItemButton onClick={() => handleListItem(srchTrcn)}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <SearchOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          color: 'text.primary',
                        }}
                        component="span"
                        variant="body1"
                        noWrap
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: `${`${srchTrcn.trcnId}(${srchTrcn.intgTrcnStaNm})`.replace(
                              kwds[1],
                              `<strong style="color: ${theme.palette.info.main}">$&</strong>`
                            )}${
                              srchTrcn.vhclNo
                                ? ` - ${srchTrcn.vhclNo?.replace(
                                    kwds[0],
                                    `<strong style="color: ${theme.palette.info.main}">$&</strong>`
                                  )}`
                                : ''
                            }`,
                          }}
                        />
                      </Typography>
                      {srchTrcn.date}
                    </React.Fragment>
                  }
                  primaryTypographyProps={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    variant: 'body2',
                    color: 'text.secondary',
                  }}
                />
                <ChevronRightOutlinedIcon sx={{ color: (theme) => theme.palette.grey[500] }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Paper elevation={0} sx={{ py: 6 }} />
      )}
    </React.Fragment>
  );
};

export default React.memo(TrcnSearchSuggestion);

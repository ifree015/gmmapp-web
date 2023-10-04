import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import useLocalStorage from '@common/hooks/useLocalStorage';
import { setLocalItem } from '@common/utils/storage';
import nativeApp from '@common/utils/nativeApp';

const TrcnDsblVhclSearchStorage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [storageSrchVhcls, setStorageSrchVhcls] = useLocalStorage('srchVhcls', []);

  const handleStorageListItem = useCallback(
    (index) => {
      const srchVhcl = storageSrchVhcls[index];
      srchVhcl.date = dayjs().format('MM.DD');
      storageSrchVhcls.splice(index, 1);
      storageSrchVhcls.unshift(srchVhcl);
      // setStorageSrchVhcls(srchVhcls);
      setLocalItem('srchVhcls', storageSrchVhcls);
      const to = `/trcndsbl?dsblAcptDtDvs=3month&dsblAcptSttDt=${dayjs()
        .subtract(3, 'month')
        .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format('YYYYMMDD')}&tropId=${
        srchVhcl.tropId
      }&tropNm=${srchVhcl.tropNm}&vhclId=${srchVhcl.vhclId}&vhclNo=${srchVhcl.vhclNo}`;
      if (nativeApp.isIOS()) {
        nativeApp.pushView(to, { title: '단말기장애' });
      } else {
        navigate(to, { state: { from: location.pathname } });
      }
    },
    [storageSrchVhcls, location, navigate]
  );

  const removeStorageListItem = useCallback(
    (index) => {
      setStorageSrchVhcls(storageSrchVhcls.filter((element, idx) => index !== idx));
    },
    [storageSrchVhcls, setStorageSrchVhcls]
  );

  return (
    <React.Fragment>
      {storageSrchVhcls.length > 0 ? (
        <List
          sx={{ bgcolor: 'background.paper' }}
          subheader={
            <ListSubheader
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                py: 1,
                pr: 0.5,
              }}
            >
              <Typography variant="subtitle2">최근 검색어</Typography>
              <Chip
                label="전체삭제"
                size="small"
                sx={{
                  color: 'text.secondary',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                }}
                onClick={() => {
                  setStorageSrchVhcls([]);
                }}
              />
            </ListSubheader>
          }
        >
          {storageSrchVhcls.map((storageSrchVhcl, index) => (
            <ListItem
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeStorageListItem(index)}
                >
                  <ClearOutlinedIcon fontSize="small" />
                </IconButton>
              }
              key={`${storageSrchVhcl.tropId}-${storageSrchVhcl.vhclId}`}
            >
              <ListItemButton onClick={() => handleStorageListItem(index)}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <HistoryOutlinedIcon />
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
                          pr: 0.5,
                        }}
                        component="span"
                        variant="body1"
                        noWrap={true}
                      >
                        {`${storageSrchVhcl.vhclNo} - ${storageSrchVhcl.tropNm}`}
                      </Typography>
                      {storageSrchVhcl.date}
                    </React.Fragment>
                  }
                  primaryTypographyProps={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    variant: 'body2',
                    color: 'text.secondary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Paper elevation={0}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ py: 6, textAlign: 'center', fontWeight: 600 }}
          >
            최근 검색어 내역이 없습니다.
          </Typography>
        </Paper>
      )}
    </React.Fragment>
  );
};

export default React.memo(TrcnDsblVhclSearchStorage);

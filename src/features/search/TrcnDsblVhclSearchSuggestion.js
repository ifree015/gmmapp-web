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

const TrcnDsblVhclSearchSuggestion = ({ onClose, data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleListItem = useCallback(
    (srchVhcl) => {
      const storageSrchVhcls = getLocalItem('srchVhcls').filter(
        (element) => srchVhcl.tropId !== element.tropId && srchVhcl.vhclId !== element.vhclId
      );
      srchVhcl.date = dayjs().format('MM.DD');
      storageSrchVhcls.unshift(srchVhcl);
      if (storageSrchVhcls.length > 10) storageSrchVhcls.pop();
      setLocalItem('srchVhcls', storageSrchVhcls);
      const to = `/trcndsbl?dsblAcptDtDvs=3month&dsblAcptSttDt=${dayjs()
        .subtract(3, 'month')
        .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format('YYYYMMDD')}&tropId=${
        srchVhcl.tropId
      }&tropNm=${srchVhcl.tropNm}&vhclId=${srchVhcl.vhclId}&vhclNo=${
        srchVhcl.vhclNo
      }&appBarHidden=${nativeApp.isIOS() ? 'Y' : ''}`;
      if (nativeApp.isIOS()) {
        nativeApp.pushView(to, { title: '단말기장애' });
        setTimeout(() => {
          onClose();
        }, 300);
      } else {
        navigate(to, { state: { from: location.pathname } });
      }
    },
    [location, navigate, onClose]
  );

  const kwds = data?.srchKwd?.split(/\s+/);
  if (kwds && kwds.length === 1) kwds.unshift('');

  return (
    <React.Fragment>
      {data?.data?.length > 0 ? (
        <List sx={{ bgcolor: 'background.paper' }}>
          {data.data.map((srchVhcl) => (
            <ListItem disablePadding key={`${srchVhcl.tropId}-${srchVhcl.vhclId}`}>
              <ListItemButton onClick={() => handleListItem(srchVhcl)}>
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
                        variant="body1"
                        noWrap={true}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: `${srchVhcl.vhclNo.replace(
                              kwds[1],
                              `<strong style="color: ${theme.palette.info.main}">$&</strong>`
                            )} - ${srchVhcl.tropNm.replace(
                              kwds[0],
                              `<strong style="color: ${theme.palette.info.main}">$&</strong>`
                            )}`,
                          }}
                        />
                      </Typography>
                      {srchVhcl.date}
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

export default React.memo(TrcnDsblVhclSearchSuggestion);

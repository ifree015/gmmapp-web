import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { useQuery } from '@common/queries/query';
import { fetchVhclTrcnList } from '@features/trcnmvmn/trcnMvmnAPI';

const VhclDetailContentTab2 = forwardRef(({ tropId, vhclId }, ref) => {
  const {
    data: { data: vhclTrcnList },
  } = useQuery(['fetchVhclTrcnList', tropId, vhclId], () => fetchVhclTrcnList({ tropId, vhclId }));

  return (
    <Box>
      <List sx={{ pt: 0 }}>
        {vhclTrcnList.map((vhclTrcn, index) => (
          <React.Fragment key={vhclTrcn.trcnId}>
            {index > 0 ? <Divider component="li" /> : null}
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: ['11', '50', '80'].includes(vhclTrcn.dvcDvsCd)
                      ? 'success.light'
                      : 'warning.light',
                  }}
                >
                  {vhclTrcn.dvcDvsNm?.substr(0, 1)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{ flexGrow: 1 }}
                primaryTypographyProps={{
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                  color: 'info.main',
                }}
                primary={vhclTrcn.dvcDvsNm}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="subtitle2"
                      sx={{
                        fontWeight: (theme) => theme.typography.fontWeightBold,
                        pr: 1,
                      }}
                    >
                      {vhclTrcn.trcnId}
                    </Typography>
                    {vhclTrcn.eqpmDvsNm}
                  </React.Fragment>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
        {vhclTrcnList.length === 0 ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              차량에 설치된 단말기가 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
    </Box>
  );
});

export default VhclDetailContentTab2;

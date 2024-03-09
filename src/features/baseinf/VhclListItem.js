import React from 'react';
import { useLocation } from 'react-router-dom';
import HybridLink from '@app//HybridLink';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
// import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import Typography from '@mui/material/Typography';
import ColorChip from '@components/ColorChip';

const VhclListItem = React.forwardRef(({ vhcl }, ref) => {
  const location = useLocation();
  return (
    <ListItem disablePadding ref={ref}>
      <ListItemButton
        component={HybridLink}
        to={`/baseinf/vhcl/${vhcl.tropId}/${vhcl.vhclId}`}
        state={{
          from: location.pathname,
          title: '차량 상세',
          subTitle: `${vhcl.vhclNo} - ${vhcl.tropNm}`,
        }}
      >
        <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
          <Avatar
            sx={{
              fontSize: 'subtitle1.fontSize',
              bgcolor: `${
                vhcl.areaCd === '11'
                  ? vhcl.troaId === '1110'
                    ? 'info.light'
                    : 'success.light'
                  : vhcl.areaCd === '12'
                  ? 'warning.light'
                  : 'error.light'
              }`,
            }}
          >
            {vhcl.areaCd === '11'
              ? vhcl.busAreaNm.substring(0, 2)
              : vhcl.stlmAreaNm.substring(0, 2)}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={0.5}>
            <ColorChip label={vhcl.stlmAreaNm} />
            <ColorChip label={vhcl.troaNm} />
          </Stack>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  sx={{
                    display: 'inline-block',
                    width: '55%',
                    textDecorationLine: vhcl.useYn === 'Y' ? 'none' : 'line-through',
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                    verticalAlign: 'top',
                  }}
                  component="span"
                  noWrap
                >
                  {vhcl.tropNm}
                </Typography>
                {` ${vhcl.vhclNo}`}
              </React.Fragment>
            }
            primaryTypographyProps={{
              color: vhcl.useYn === 'Y' ? 'info.main' : 'text.disabled',
              sx: { textDecorationLine: vhcl.useYn === 'Y' ? 'none' : 'line-through' },
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            secondary={vhcl.bsfcNm}
          />
          {/* <ListItemText
            primary={
              <React.Fragment>
                {vhcl.vhclNo}
                <Typography
                  sx={{
                    pl: 2,
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                  }}
                  component="span"
                >
                  {vhcl.tropNm}
                </Typography>
              </React.Fragment>
            }
            primaryTypographyProps={{
              color: vhcl.useYn === 'Y' ? 'info.main' : 'text.disabled',
              sx: { textDecorationLine: vhcl.useYn === 'Y' ? 'none' : 'line-through' },
              fontWeight: (theme) => theme.typography.fontWeightBold,
              noWrap: true,
            }}
            secondary={vhcl.bsfcNm}
          /> */}
          <ListItemText
            primary={vhcl.rcvIntgTrcnId ? `${vhcl.rcvIntgTrcnId}(${vhcl.rcvIntgTrcnDvsNm})` : ''}
            primaryTypographyProps={{
              variant: 'subtitle2',
              color: 'text.secondary',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            secondary={vhcl.unslMttr}
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
});

export default React.memo(VhclListItem);

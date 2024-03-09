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
// import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ColorChip from '@components/ColorChip';

const TropListItem = React.forwardRef(({ trop }, ref) => {
  const location = useLocation();
  return (
    <ListItem disablePadding ref={ref}>
      <ListItemButton
        component={HybridLink}
        to={`/baseinf/trop/${trop.tropId}`}
        state={{
          from: location.pathname,
          title: '교통사업자 상세',
          subTitle: trop.tropNm,
        }}
      >
        <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
          <Avatar
            sx={{
              fontSize: 'subtitle1.fontSize',
              bgcolor: `${
                trop.areaCd === '11'
                  ? trop.troaId === '1110'
                    ? 'info.light'
                    : 'success.light'
                  : trop.areaCd === '12'
                  ? 'warning.light'
                  : 'error.light'
              }`,
            }}
          >
            {trop.areaCd === '11'
              ? trop.busAreaNm.substring(0, 2)
              : trop.stlmAreaNm.substring(0, 2)}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={0.5}>
            <ColorChip label={trop.stlmAreaNm} />
            <ColorChip label={trop.troaNm} />
          </Stack>
          <ListItemText
            primary={trop.tropNm}
            primaryTypographyProps={{
              fontWeight: (theme) => theme.typography.fontWeightBold,
              color: trop.useYn === 'Y' ? 'info.main' : 'text.disabled',
              sx: { textDecorationLine: trop.useYn === 'Y' ? 'none' : 'line-through' },
            }}
            secondary={`${trop.tropId}, 사업자: ${trop.brn.replace(
              /(\d{3})(\d{2})(\d{5})/,
              '$1-$2-$3'
            )}`}
            secondaryTypographyProps={{ sx: { whiteSpace: 'pre-line' } }}
          />
          <ListItemText
            primary={trop.dprtNm}
            primaryTypographyProps={{
              variant: 'subtitle2',
              color: 'text.secondary',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
});

export default React.memo(TropListItem);

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
// import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';
import ColorChip from '@components/ColorChip';

const BusBsfcListItem = React.forwardRef(({ busBsfc }, ref) => {
  const location = useLocation();
  return (
    <ListItem disablePadding ref={ref} alignItems="flex-start">
      <ListItemButton
        component={HybridLink}
        to={`/baseinf/busbsfc/${busBsfc.tropId}/${busBsfc.busBsfcId}`}
        state={{
          from: location.pathname,
          title: '버스영업소 상세',
          subTitle: busBsfc.bsfcNm,
        }}
      >
        <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
          <Avatar
            sx={{
              fontSize: 'subtitle1.fontSize',
              bgcolor: `${
                busBsfc.areaCd === '11'
                  ? busBsfc.troaId === '1110'
                    ? 'info.light'
                    : 'success.light'
                  : busBsfc.areaCd === '12'
                  ? 'warning.light'
                  : 'error.light'
              }`,
            }}
          >
            {busBsfc.areaCd === '11'
              ? busBsfc.busAreaNm.substring(0, 2)
              : busBsfc.stlmAreaNm.substring(0, 2)}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={0.5}>
            <ColorChip label={busBsfc.stlmAreaNm} />
            <ColorChip label={busBsfc.tropNm} />
          </Stack>
          <ListItemText
            primary={busBsfc.bsfcNm}
            primaryTypographyProps={{
              fontWeight: (theme) => theme.typography.fontWeightBold,
              color: busBsfc.useYn === 'Y' ? 'info.main' : 'text.disabled',
              sx: { textDecorationLine: busBsfc.useYn === 'Y' ? 'none' : 'line-through' },
            }}
            secondary={busBsfc.hqYn === 'Y' ? '본사' : '지사'}
          />
          <ListItemText
            primary={busBsfc.dprtNm}
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

export default React.memo(BusBsfcListItem);

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
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined';
import Typography from '@mui/material/Typography';
import { INTG_TRCN_STA_CD } from '@common/constants/appConstants';
import ColorChip from '@components/ColorChip';

const TrcnListItem = React.forwardRef(({ trcn }, ref) => {
  const location = useLocation();

  return (
    <ListItem disablePadding ref={ref} alignItems="flex-start">
      <ListItemButton
        component={HybridLink}
        to={`/trcnprcn/trcn/${trcn.trcnId}`}
        state={{
          from: location.pathname,
          title: '단말기 상세',
          subTitle: `${trcn.trcnId}(${trcn.intgTrcnStaNm})${
            trcn.vhclNo ? ` - ${trcn.vhclNo}` : ''
          }`,
        }}
      >
        <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
          <Avatar
            sx={{
              bgcolor:
                INTG_TRCN_STA_CD.USING === trcn.intgTrcnStaCd
                  ? 'success.light'
                  : INTG_TRCN_STA_CD.BAD === trcn.intgTrcnStaCd
                  ? 'warning.light'
                  : 'info.light',
            }}
          >
            {INTG_TRCN_STA_CD.USING === trcn.intgTrcnStaCd ? (
              <DirectionsBusOutlinedIcon />
            ) : INTG_TRCN_STA_CD.BAD === trcn.intgTrcnStaCd ? (
              <CreditCardOffOutlinedIcon />
            ) : (
              <span>{trcn.intgTrcnStaNm.substring(0, 1)}</span>
            )}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={0.5}>
            <ColorChip label={trcn.stlmAreaNm} />
            <ColorChip label={trcn.prsLocNm} />
            <ColorChip color="warning" label={trcn.intgTrcnStaNm} />
          </Stack>
          <ListItemText
            primary={trcn.trcnId}
            primaryTypographyProps={{
              fontWeight: (theme) => theme.typography.fontWeightBold,
              color: 'info.main',
            }}
          />
          <ListItemText
            primary={trcn.trcnDvsNm}
            primaryTypographyProps={{
              variant: 'subtitle2',
              color: 'text.secondary',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            secondary={`${trcn.eqpmDvsNm}${trcn.dvcDvsNm ? ', ' + trcn.dvcDvsNm : ''}`}
          />
          {trcn.vhclId ? (
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography
                    sx={{
                      display: 'inline-block',
                      width: '55%',
                      fontWeight: (theme) => theme.typography.fontWeightBold,
                      verticalAlign: 'top',
                    }}
                    component="span"
                    variant="subtitle2"
                    noWrap
                  >
                    {trcn.tropNm}
                  </Typography>
                  {` ${trcn.vhclNo}`}
                </React.Fragment>
              }
              primaryTypographyProps={{
                variant: 'subtitle2',
                color: 'text.secondary',
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            />
          ) : null}
        </Box>
      </ListItemButton>
    </ListItem>
  );
});

export default React.memo(TrcnListItem);

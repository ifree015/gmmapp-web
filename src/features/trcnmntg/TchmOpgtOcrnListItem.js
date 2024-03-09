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
import ColorChip from '@components/ColorChip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

const numberFormat = new Intl.NumberFormat();
const fractionNumberFormat = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1 });

const TchmOpgtOcrnListItem = React.forwardRef(({ tchmOpgtOcrn }, ref) => {
  const location = useLocation();
  return (
    <ListItem disablePadding ref={ref} alignItems="flex-start">
      <ListItemButton
        component={HybridLink}
        to={`/trcnmntg/tchmopgtocrn/${tchmOpgtOcrn.tropId}/${tchmOpgtOcrn.vhclId}/${tchmOpgtOcrn.drvrDrcsId}/${tchmOpgtOcrn.oprnDeprDtm}`}
        state={{
          from: location.pathname,
          title: '타코개폐발생 상세',
          subTitle: `${tchmOpgtOcrn.vhclNo} - ${tchmOpgtOcrn.tropNm}`,
        }}
      >
        <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
          <Avatar
            sx={{
              fontSize: 'subtitle1.fontSize',
              bgcolor: `${
                tchmOpgtOcrn.areaCd === '11'
                  ? tchmOpgtOcrn.troaId === '1110'
                    ? 'info.light'
                    : 'success.light'
                  : tchmOpgtOcrn.areaCd === '12'
                  ? 'warning.light'
                  : 'error.light'
              }`,
            }}
          >
            {tchmOpgtOcrn.areaCd === '11'
              ? tchmOpgtOcrn.busAreaNm.substring(0, 2)
              : tchmOpgtOcrn.stlmAreaNm.substring(0, 2)}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={0.5}>
            <ColorChip label={tchmOpgtOcrn.stlmAreaNm} />
            <ColorChip label={tchmOpgtOcrn.tropNm} />
          </Stack>
          <ListItemText
            primary={
              <React.Fragment>
                {tchmOpgtOcrn.vhclNo}
                <Typography
                  sx={{
                    pl: 2,
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                  }}
                  component="span"
                >
                  {tchmOpgtOcrn.bsfcNm}
                </Typography>
              </React.Fragment>
            }
            primaryTypographyProps={{
              color: 'info.main',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            secondary={`${tchmOpgtOcrn.rotNm}\n${dayjs(
              tchmOpgtOcrn.oprnDeprDtm,
              'YYYYMMDDHHmmss'
            ).format('YYYY.MM.DD HH:mm')} ~ ${
              tchmOpgtOcrn.oprnDeprDtm.startsWith(tchmOpgtOcrn.oprnEndDtm.substring(0, 4))
                ? dayjs(tchmOpgtOcrn.oprnEndDtm, 'YYYYMMDDHHmmss').format('MM.DD HH:mm')
                : dayjs(tchmOpgtOcrn.oprnEndDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm')
            }(${numberFormat.format(tchmOpgtOcrn.oprnTime)}분)`}
            secondaryTypographyProps={{ sx: { whiteSpace: 'pre-line' } }}
          />
          <ListItemText
            primary={`${tchmOpgtOcrn.drvrDrcsId}(${tchmOpgtOcrn.drvrDrcsTrcnDvsNm})`}
            secondary={`속도: ${numberFormat.format(
              tchmOpgtOcrn.tchmSpdRto
            )}%, 개문(앞/뒤): ${fractionNumberFormat.format(
              tchmOpgtOcrn.frdrOpgtDrtm / 60.0
            )}/${fractionNumberFormat.format(tchmOpgtOcrn.bcdrOpgtDrtm / 60.0)}(분)`}
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

export default React.memo(TchmOpgtOcrnListItem);

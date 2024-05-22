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
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import Typography from '@mui/material/Typography';
import PatchTooltip from '@components/PatchTooltip';
import ColorChip from '@components/ColorChip';
import dayjs from 'dayjs';
import { DSBL_ACPT_DVS_CD } from '@common/constants/appConstants';

const CentTrcnDsblListItem = React.forwardRef(({ trcnDsbl }, ref) => {
  const location = useLocation();
  return (
    <ListItem disablePadding ref={ref}>
      <ListItemButton
        component={HybridLink}
        to={`/trcndsbl/trcndsbl/${trcnDsbl.stlmAreaCd}/${trcnDsbl.dsblAcptNo}`}
        state={{
          from: location.pathname,
          barSwipable: false,
          title: '단말기장애 상세',
          subTitle: `${trcnDsbl.vhclNo} - ${trcnDsbl.tropNm}`,
        }}
      >
        <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
          <Avatar
            sx={{
              bgcolor: trcnDsbl.dsblPrcgFnDtm ? 'success.light' : 'warning.light',
            }}
          >
            {DSBL_ACPT_DVS_CD.TEL.code === trcnDsbl.dsblAcptDvsCd ? (
              <CallOutlinedIcon />
            ) : DSBL_ACPT_DVS_CD.SYSTEM.code === trcnDsbl.dsblAcptDvsCd ? (
              <DvrOutlinedIcon />
            ) : (
              <DirectionsWalkOutlinedIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ width: 'calc(100% - 56px)' }}>
          <Stack direction="row" spacing={0.5}>
            <PatchTooltip title={trcnDsbl.dprtNm ?? '미배정'}>
              <ColorChip
                label={trcnDsbl.dprtNm ? trcnDsbl.dprtNm.substring(0, 2) : '미배정'}
                color={trcnDsbl.dprtNm ? 'secondary' : 'warning'}
              />
            </PatchTooltip>
            <ColorChip label={trcnDsbl.dsblAcptDvsNm} />
            <ColorChip
              color="warning"
              label={
                trcnDsbl.areaCd === '11'
                  ? trcnDsbl.busAreaNm.substring(0, 2)
                  : trcnDsbl.stlmAreaNm.substring(0, 2)
              }
            />
          </Stack>
          <ListItemText
            primary={
              <React.Fragment>
                {trcnDsbl.vhclNo}
                <Typography
                  sx={{
                    pl: 1,
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                  }}
                  component="span"
                >
                  {trcnDsbl.bsfcNm}
                </Typography>
              </React.Fragment>
            }
            primaryTypographyProps={{
              color: 'info.main',
              fontWeight: (theme) => theme.typography.fontWeightBold,
              noWrap: true,
            }}
            secondary={`${trcnDsbl.rotNo ? `${trcnDsbl.rotNo} 노선, ` : ''} ${dayjs(
              trcnDsbl.dsblAcptDtm,
              'YYYYMMDDHHmmss'
            ).format('YYYY.MM.DD HH:mm')}`}
          />
          <ListItemText
            primary={`${trcnDsbl.busTrcnErrTypNm ?? '유형없음'}, ${trcnDsbl.trcnDvsNm}`}
            primaryTypographyProps={{
              fontSize: 14,
              color: 'text.secondary',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            secondary={trcnDsbl.dsblPrcgPicNm}
          />
          <ListItemText
            primary={trcnDsbl.trcnErrPrcgTypNm}
            primaryTypographyProps={{
              fontSize: 14,
              color: 'text.secondary',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            secondary={`${
              trcnDsbl.dsblPrcgFnDtm
                ? `${dayjs(trcnDsbl.dsblPrcgFnDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm')}, ${
                    trcnDsbl.prsrNm
                  }`
                : ''
            }`}
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
});

export default React.memo(CentTrcnDsblListItem);

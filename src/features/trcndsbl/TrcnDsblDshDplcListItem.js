import React from 'react';
import { useLocation } from 'react-router-dom';
import HybridLink from '@app//HybridLink';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { DSBL_ACPT_DVS_CD } from '@common/constants/appConstants';

export default function TrcnDsblDshDplcListItem({ dplcTrcnDsbl }) {
  const location = useLocation();

  const queryParams = {
    dsblAcptDtDvs: '3month',
    dsblAcptSttDt: dayjs().subtract(3, 'month').format('YYYYMMDD'),
    dsblAcptEndDt: dayjs().format('YYYYMMDD'),
    tropId: dplcTrcnDsbl.tropId,
    tropNm: dplcTrcnDsbl.tropNm,
    vhclId: dplcTrcnDsbl.vhclId,
    vhclNo: dplcTrcnDsbl.vhclNo,
    busTrcnErrTypCd: dplcTrcnDsbl.busTrcnErrTypCd,
    busTrcnErrTypNm: dplcTrcnDsbl.busTrcnErrTypNm,
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={HybridLink}
        to={`/trcndsbl/trcndsbl?` + new URLSearchParams(queryParams).toString()}
        state={{
          from: location.pathname,
          title: '단말기장애',
        }}
      >
        <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
          <Avatar
            sx={{
              bgcolor: 'info.light',
            }}
          >
            {DSBL_ACPT_DVS_CD.TEL.code === dplcTrcnDsbl.dsblAcptDvsCd ? (
              <CallOutlinedIcon />
            ) : DSBL_ACPT_DVS_CD.SYSTEM.code === dplcTrcnDsbl.dsblAcptDvsCd ? (
              <DvrOutlinedIcon />
            ) : (
              <DirectionsWalkOutlinedIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <Box>
          <ListItemText
            primary={dplcTrcnDsbl.vhclNo}
            secondary={dayjs(dplcTrcnDsbl.dsblAcptDtm, 'YYYYMMDDHHmmss').format(
              'YYYY.MM.DD HH:mm:ss'
            )}
            primaryTypographyProps={{
              color: 'info.main',
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            sx={{ mt: 0 }}
          />
          <ListItemText
            secondary={
              <React.Fragment>
                <Typography component="span" variant="body2" color="text.primary">
                  {dplcTrcnDsbl.tropNm}
                </Typography>
                {` — ${dplcTrcnDsbl.vhclNo}차량 3개월 내 동일 오류코드유형(`}
                <strong>{dplcTrcnDsbl.busTrcnErrTypNm}</strong>
                {`)으로 ${dplcTrcnDsbl.cnt}건`}
              </React.Fragment>
            }
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
}

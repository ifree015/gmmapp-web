import React, { useState } from 'react';
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
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOUtlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Collapse from '@mui/material/Collapse';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import dayjs from 'dayjs';
import { DSBL_ACPT_DVS_CD } from '@common/constants/appConstants';
import { useQuery } from '@common/queries/query';
import { fetchDplcTrcnDsblHst } from '@features/trcndsbl/trcnDsblAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';

const fractionNumberFormat = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 });

const DplcTrcnDsblListItem = React.forwardRef(
  ({ dplcTrcnDsbl, dsblAcptSttDt, dsblAcptEndDt }, ref) => {
    const [collapse, setCollapse] = useState(true);
    const [dplcTrcnDsblHsts, setDplcTrcnDsblHsts] = useState(undefined);

    const queryParams = {
      dsblAcptSttDt: dsblAcptSttDt,
      dsblAcptEndDt: dsblAcptEndDt,
      tropId: dplcTrcnDsbl.tropId,
      tropNm: dplcTrcnDsbl.tropNm,
      vhclId: dplcTrcnDsbl.vhclId,
      vhclNo: dplcTrcnDsbl.vhclNo,
      busTrcnErrTypCd: dplcTrcnDsbl.busTrcnErrTypCd,
    };

    const monthDiff = fractionNumberFormat.format(
      dayjs(queryParams.dsblAcptEndDt, 'YYYYMMDD').diff(
        dayjs(queryParams.dsblAcptSttDt, 'YYYYMMDD'),
        'month',
        true
      )
    );

    const { isFetching, refetch } = useQuery(
      [
        'fetchDplcTrcnDsblHst',
        dplcTrcnDsbl.tropId,
        dplcTrcnDsbl.vhclId,
        dplcTrcnDsbl.busTrcnErrTypCd,
      ],
      () => fetchDplcTrcnDsblHst(queryParams),
      {
        enabled: false,
        suspense: false,
        onSuccess: ({ data }) => {
          setDplcTrcnDsblHsts(data);
        },
      }
    );

    return (
      <ListItem disablePadding ref={ref} sx={{ flexDirection: 'column' }}>
        <ListItemButton
          component={HybridLink}
          to={`/trcndsbl/trcndsbl?` + new URLSearchParams(queryParams).toString()}
          state={{
            title: '단말기 장애',
          }}
          sx={{ width: '100%', pb: 0 }}
        >
          <ListItemAvatar sx={{ alignSelf: 'flex-start' }}>
            <Avatar
              sx={{
                fontSize: 'subtitle1.fontSize',
                bgcolor: `${
                  dplcTrcnDsbl.areaCd === '11'
                    ? dplcTrcnDsbl.troaId === '1110'
                      ? 'info.light'
                      : 'success.light'
                    : dplcTrcnDsbl.areaCd === '12'
                    ? 'warning.light'
                    : 'error.light'
                }`,
              }}
            >
              {dplcTrcnDsbl.areaCd === '11'
                ? dplcTrcnDsbl.busAreaNm.substring(0, 2)
                : dplcTrcnDsbl.stlmAreaNm.substring(0, 2)}
            </Avatar>
          </ListItemAvatar>
          <Box>
            <Stack direction="row" spacing={0.5}>
              <ColorChip label={dplcTrcnDsbl.stlmAreaNm} />
              <ColorChip label={dplcTrcnDsbl.troaNm} />
            </Stack>
            <ListItemText
              primary={dplcTrcnDsbl.vhclNo}
              secondary={`${dayjs(dplcTrcnDsbl.dsblAcptDtm, 'YYYYMMDDHHmmss').format(
                'YYYY.MM.DD HH:mm'
              )}, ${dplcTrcnDsbl.dsblAcptDvsNm}`}
              primaryTypographyProps={{
                color: 'info.main',
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            />
          </Box>
        </ListItemButton>
        <ListItemButton
          onClick={(event) => {
            setCollapse(!collapse);
            if (!dplcTrcnDsblHsts) {
              refetch();
            }
          }}
          sx={{ pt: 0 }}
        >
          <ListItemText
            secondary={
              <React.Fragment>
                <Typography component="span" variant="body2" color="text.primary">
                  {dplcTrcnDsbl.tropNm}
                </Typography>
                {` — ${dplcTrcnDsbl.vhclNo}차량 ${monthDiff}개월 내 동일 오류코드유형(`}
                <strong>{dplcTrcnDsbl.busTrcnErrTypNm}</strong>
                {`)으로 ${dplcTrcnDsbl.cnt}건`}
              </React.Fragment>
            }
          />
          {collapse ? (
            <ExpandMoreOUtlinedIcon sx={{ alignSelf: 'flex-end' }} />
          ) : (
            <ExpandLessOutlinedIcon sx={{ alignSelf: 'flex-end' }} />
          )}
        </ListItemButton>
        <Collapse in={!collapse} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
          <React.Fragment>
            {isFetching && <PartLoadingSpinner />}
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
              }}
            >
              {dplcTrcnDsblHsts?.map((dplcTrcnDsblHst, index) => (
                <TimelineItem key={`${dplcTrcnDsblHst.stlmAreaCd}-${dplcTrcnDsblHst.dsblAcptNo}`}>
                  <TimelineSeparator>
                    <TimelineDot color={index === 0 ? 'secondary' : 'grey'}>
                      {DSBL_ACPT_DVS_CD.TEL.code === dplcTrcnDsblHst.dsblAcptDvsCd ? (
                        <CallOutlinedIcon sx={{ fontSize: 'subtitle1.fontSize' }} />
                      ) : DSBL_ACPT_DVS_CD.SYSTEM.code === dplcTrcnDsblHst.dsblAcptDvsCd ? (
                        <DvrOutlinedIcon sx={{ fontSize: 'subtitle1.fontSize' }} />
                      ) : (
                        <DirectionsWalkOutlinedIcon sx={{ fontSize: 'subtitle1.fontSize' }} />
                      )}
                    </TimelineDot>
                    {index + 1 < dplcTrcnDsblHsts.length ? <TimelineConnector /> : null}
                  </TimelineSeparator>
                  <TimelineContent>
                    <ListItemText
                      primary={dplcTrcnDsblHst.dsblAcptDvsNm}
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                      }}
                      secondary={`${dayjs(dplcTrcnDsblHst.dsblAcptDtm, 'YYYYMMDDHHmmss').format(
                        'YYYY.MM.DD HH:mm:ss'
                      )}`}
                      sx={{ mt: 0 }}
                    />
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </React.Fragment>
        </Collapse>
      </ListItem>
    );
  }
);

export default React.memo(DplcTrcnDsblListItem);

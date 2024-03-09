import React from 'react';
import { useLocation } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import LabelValueListItem from '@components/LabelValueListItem';
import LabelListItem from '@components/LabelListItem';
import Link from '@mui/material/Link';
import HybridLink from '@app//HybridLink';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CommitOutlinedIcon from '@mui/icons-material/CommitOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import dayjs from 'dayjs';
import { unescape } from 'html-escaper';

export default function TrcnDetailContentTab2({ trcnMvmnHsts }) {
  const location = useLocation();

  return (
    <Stack
      spacing={2}
      sx={{
        'mt': 0.75,
        '& .MuiCard-root:first-of-type': {
          border: 0,
        },
      }}
    >
      {trcnMvmnHsts.map((trcnMvmnHst, index) => (
        <Card key={trcnMvmnHst.updDtm} elevation={0} sx={{ borderTop: 1, borderColor: 'divider' }}>
          <CardHeader
            avatar={
              <Avatar
                sx={{
                  bgcolor: 'warning.light',
                }}
              >
                {trcnMvmnHst.intgTrcnStaNm.substring(0, 1)}
              </Avatar>
            }
            title={dayjs(trcnMvmnHst.updDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
            titleTypographyProps={
              {
                // fontWeight: (theme) => theme.typography.fontWeightBold,
              }
            }
            subheader={`${trcnMvmnHst.trcnMvmnFixYn === 'Y' ? '확정' : '미확정'}, ${
              trcnMvmnHst.intgTrcnStaNm
            }`}
          />
          <Stepper sx={{ ml: 1, mr: 2 }}>
            <Step active={false}>
              <StepLabel
                StepIconComponent={CommitOutlinedIcon}
                StepIconProps={{ active: 'false', completed: 'false', error: 'false' }}
                sx={{ color: 'text.secondary' }}
              >
                {trcnMvmnHst.mvmnBefLocNm}
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                StepIconComponent={ChevronRightOutlinedIcon}
                StepIconProps={{ active: 'false', completed: 'false', error: 'false' }}
                sx={{ color: 'text.secondary' }}
              >
                {trcnMvmnHst.mvmnAftLocNm}
              </StepLabel>
            </Step>
          </Stepper>
          <List aria-label="단말기이동 정보">
            {/* <LabelValueListItem label="정산지역" value={trcnMvmnHst.stlmAreaNm} /> */}
            <LabelValueListItem label="교통사업자" value={trcnMvmnHst.tropNm ?? ''} />
            <LabelValueListItem label="버스영업소" value={trcnMvmnHst.bsfcNm ?? ''} />
            <LabelValueListItem label="차량번호" value={trcnMvmnHst.vhclNo ?? ''} />
            <LabelListItem label="장애접수번호">
              <Link
                sx={{ fontSize: 'body2.fontSize' }}
                component={HybridLink}
                to={`/trcndsbl/trcndsbl/${trcnMvmnHst.stlmAreaCd}/${trcnMvmnHst.dsblAcptNo}`}
                state={{
                  from: location.pathname,
                  title: '단말기장애 상세',
                  subTitle: `${trcnMvmnHst.vhclNo} - ${trcnMvmnHst.tropNm}`,
                }}
              >
                {trcnMvmnHst.dsblAcptNo}
              </Link>
            </LabelListItem>
            <LabelValueListItem label="오류유형" value={trcnMvmnHst.busTrcnErrTypNm ?? ''} />
            <LabelValueListItem label="비고" value={unescape(trcnMvmnHst.trcnModRsn ?? '')} />
            <LabelValueListItem label="담당자" value={trcnMvmnHst.trcnModPicNm} />
          </List>
        </Card>
      ))}
    </Stack>
  );
}

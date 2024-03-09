import React from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import List from '@mui/material/List';
import LabelValueListItem from '@components/LabelValueListItem';
import dayjs from 'dayjs';

export default function TropDetailContentTab2({ trop }) {
  return (
    <Stack
      spacing={1}
      sx={{
        '& .MuiCard-root:first-of-type': {
          border: 0,
        },
      }}
    >
      {trop.trobRots.map((trobRot, index) => (
        <Card
          key={`${trobRot.stlmAreaCd}${trobRot.rotId}`}
          elevation={0}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        >
          <CardHeader
            avatar={
              <Avatar
                sx={{
                  bgcolor: 'warning.light',
                }}
              >
                <RouteOutlinedIcon />
              </Avatar>
            }
            title={`${trobRot.rotNo}(${trobRot.rotId})`}
            titleTypographyProps={
              {
                // fontWeight: (theme) => theme.typography.fontWeightBold,
              }
            }
            subheader={trobRot.rotNm}
          />
          <List aria-label="교통사업자버스노선 정보" sx={{ pt: 0 }}>
            <LabelValueListItem
              label="버스영업소"
              value={`${trobRot.bsfcNm}(${trobRot.busBsfcId})`}
            />
            <LabelValueListItem label="표준노선ID" value={trobRot.stndRotId} />
            <LabelValueListItem label="교통수단" value={trobRot.mntnNm} />
            <LabelValueListItem label="운행차량수" value={trobRot.opvhNum} />
            <LabelValueListItem
              label="최종적용일시"
              value={dayjs(trobRot.adptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
            />
            <LabelValueListItem
              label="최초적용일시"
              value={dayjs(trobRot.minAdptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
            />
          </List>
        </Card>
      ))}
    </Stack>
  );
}

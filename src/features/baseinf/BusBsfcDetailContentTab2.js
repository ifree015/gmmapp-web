import React from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import List from '@mui/material/List';
import LabelValueListItem from '@components/LabelValueListItem';
import dayjs from 'dayjs';

export default function BusBsfcDetailContentTab2({ busBsfc }) {
  return (
    <Stack
      spacing={1}
      sx={{
        '& .MuiCard-root:first-of-type': {
          border: 0,
        },
      }}
    >
      {busBsfc.busBsfcBusRots.map((busBsfcBusRot, index) => (
        <Card
          key={`${busBsfcBusRot.stlmAreaCd}${busBsfcBusRot.rotId}`}
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
            title={`${busBsfcBusRot.rotNo}(${busBsfcBusRot.rotId})`}
            titleTypographyProps={
              {
                // fontWeight: (theme) => theme.typography.fontWeightBold,
              }
            }
            subheader={busBsfcBusRot.rotNm}
          />
          <List aria-label="버스영업소버스노선 정보" sx={{ pt: 0 }}>
            <LabelValueListItem label="표준노선ID" value={busBsfcBusRot.stndRotId} />
            <LabelValueListItem label="교통수단" value={busBsfcBusRot.mntnNm} />
            <LabelValueListItem label="운행차량수" value={busBsfcBusRot.opvhNum} />
            <LabelValueListItem
              label="최종적용일시"
              value={dayjs(busBsfcBusRot.adptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
            />
            <LabelValueListItem
              label="최초적용일시"
              value={dayjs(busBsfcBusRot.minAdptDtm, 'YYYYMMDDHHmmss').format(
                'YYYY.MM.DD HH:mm:ss'
              )}
            />
          </List>
        </Card>
      ))}
    </Stack>
  );
}

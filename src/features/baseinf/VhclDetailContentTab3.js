import React from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import List from '@mui/material/List';
import LabelValueListItem from '@components/LabelValueListItem';
import dayjs from 'dayjs';

export default function VhclDetailContentTab3({ vhcl }) {
  return (
    <Stack
      spacing={1}
      sx={{
        '& .MuiCard-root:first-of-type': {
          border: 0,
        },
      }}
    >
      {vhcl.vhclBusRots.map((vhclBusRot, index) => (
        <Card
          key={`${vhclBusRot.stlmAreaCd}${vhclBusRot.rotId}`}
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
            title={`${vhclBusRot.rotNo}(${vhclBusRot.rotId})`}
            titleTypographyProps={
              {
                // fontWeight: (theme) => theme.typography.fontWeightBold,
              }
            }
            subheader={vhclBusRot.rotNm}
          />
          <List aria-label="차량버스노선 정보" sx={{ pt: 0 }}>
            <LabelValueListItem
              label="버스영업소"
              value={`${vhclBusRot.bsfcNm}(${vhclBusRot.busBsfcId})`}
            />
            <LabelValueListItem label="표준노선ID" value={vhclBusRot.stndRotId} />
            <LabelValueListItem
              label="최종적용일시"
              value={dayjs(vhclBusRot.adptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
            />
            <LabelValueListItem
              label="최초적용일시"
              value={dayjs(vhclBusRot.minAdptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
            />
          </List>
        </Card>
      ))}
    </Stack>
  );
}

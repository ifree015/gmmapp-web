import React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useQuery } from '@common/queries/query';
import { fetchDplcTrcnDsblPrcn } from '@features/trcndsbl/trcnDsblAPI';
import dayjs from 'dayjs';
import TrcnDsblDshDplcListItem from './TrcnDsblDshDplcListItem';

export default function TrcnDsblDshDplcList() {
  const queryParams = {
    dsblAcptDt: dayjs().format('YYYYMMDD'),
  };

  const { data: dplcTrcnDsbls } = useQuery(
    ['fetchDplcTrcnDsblPrcn'],
    () => fetchDplcTrcnDsblPrcn(queryParams),
    {
      select: ({ data }) => {
        return data;
      },
    }
  );

  return (
    <List
      sx={{ bgcolor: 'background.paper' }}
      subheader={
        <ListSubheader
          align="left"
          disableSticky
          sx={{
            fontSize: 'subtitle1.fontSize',
            fontWeight: (theme) => theme.typography.fontWeightBold,
          }}
        >
          중복단말기장애 현황
        </ListSubheader>
      }
    >
      {/* <ListItem>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: (theme) => theme.typography.fontWeightBold,
            color: 'text.secondary',
          }}
        >
          중복단말기장애 현황
        </Typography>
      </ListItem> */}
      {dplcTrcnDsbls.length > 0 ? (
        dplcTrcnDsbls.map((dplcTrcnDsbl, index) => (
          <React.Fragment
            key={`${dplcTrcnDsbl.tropId}-${dplcTrcnDsbl.vhclId}-${dplcTrcnDsbl.busTrcnErrTypCd}`}
          >
            {index > 0 ? <Divider variant="inset" component="li" /> : null}
            <TrcnDsblDshDplcListItem dplcTrcnDsbl={dplcTrcnDsbl} />
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <Alert severity="info" sx={{ flexGrow: 1 }}>
            접수된 중복장애내역이 없습니다.
          </Alert>
        </ListItem>
      )}
    </List>
  );
}

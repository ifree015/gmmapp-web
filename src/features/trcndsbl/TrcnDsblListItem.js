import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { DSBL_ACPT_DVS_CD } from '@common/constants/appConstants';

const TrcnDsblListItem = React.forwardRef(({ trcnDsbl }, ref) => {
  const location = useLocation();
  return (
    <ListItem disablePadding ref={ref}>
      <ListItemButton
        component={RouterLink}
        to={`/trcndsbl/trcndsbldetail/${trcnDsbl.stlmAreaCd}/${trcnDsbl.dsblAcptNo}`}
        state={{ from: location.pathname }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: trcnDsbl.dsblPrcgFnDtm ? 'success.light' : 'warning.light',
            }}
          >
            {DSBL_ACPT_DVS_CD.TEL === trcnDsbl.dsblAcptDvsCd ? (
              <CallOutlinedIcon />
            ) : DSBL_ACPT_DVS_CD.TEL === trcnDsbl.dsblAcptDvsCd ? (
              <DirectionsWalkOutlinedIcon />
            ) : (
              <DvrOutlinedIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={trcnDsbl.dprtNm ?? '오배정'}>
              <Chip
                label={trcnDsbl.dprtNm?.substring(0, 2) ?? '오배'}
                color={trcnDsbl.dprtNm ? 'secondary' : 'error'}
                sx={{
                  'height': 20,
                  'fontSize': 12,
                  '& .MuiChip-label': { px: 1 },
                }}
              ></Chip>
            </Tooltip>
            <Chip
              label={trcnDsbl.dsblAcptDvsNm}
              color="secondary"
              sx={{
                'height': 20,
                'fontSize': 12,
                '& .MuiChip-label': { px: 1 },
              }}
            ></Chip>
          </Stack>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  sx={{
                    display: 'inline-block',
                    width: '50%',
                    fontWeight: 600,
                    verticalAlign: 'middle',
                  }}
                  component="span"
                  variant="body1"
                  noWrap={true}
                  color="primary"
                >
                  {trcnDsbl.tropNm}
                </Typography>
                {trcnDsbl.vhclNo}
              </React.Fragment>
            }
            primaryTypographyProps={{
              color: 'primary',
              fontWeight: 600,
            }}
          />
          <ListItemText
            primary={trcnDsbl.busTrcnErrTypNm ?? '유형없음'}
            primaryTypographyProps={{ fontSize: 14, color: 'text.secondary', fontWeight: 600 }}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{
                    display: 'inline-block',
                    width: '50%',
                  }}
                  variant="body2"
                  component="span"
                >
                  {dayjs(trcnDsbl.dsblAcptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm')}
                </Typography>
                {trcnDsbl.dsblPrcgFnDtm
                  ? dayjs(trcnDsbl.dsblPrcgFnDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm')
                  : ''}
              </React.Fragment>
            }
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
});

export default React.memo(TrcnDsblListItem);

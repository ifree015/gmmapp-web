import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NTFC_CRTN_CT_VAL } from '@common/constants/appConstants';
import 'dayjs/locale/ko';
import { useMutation } from '@common/queries/query';
import { deleteNtfcPt } from '@features/notification/notificationAPI';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useError from '@common/hooks/useError';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const NotificationListItem = React.forwardRef(({ ntfcPt, refetchData, onParentClose }, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const openAlertSnackbar = useAlertSnackbar();
  const openError = useError();

  const { mutate, reset } = useMutation(deleteNtfcPt, {
    onError: (err) => {
      openError(err, reset);
    },
    onSuccess: (data) => {
      (async () => {
        // await openAlert(data.message);
        refetchData();
        await openAlertSnackbar('info', data.message, true);
      })();
    },
  });

  const handleClick = (cnctMoappScrnVal, ntgtVal) => {
    if (!cnctMoappScrnVal) return;
    const isCurrentPage = location.pathname === cnctMoappScrnVal;
    // location.pathname === cnctMoappScrnVal ||
    // [location.pathname, cnctMoappScrnVal].every((value) =>
    //   value.startsWith('/trcndsbl/trcndsbldetail')
    // );

    if (isCurrentPage) {
      onParentClose();
    }

    const toLocation = cnctMoappScrnVal + (ntgtVal ? '?' + ntgtVal : '');
    navigate(toLocation, {
      replace: isCurrentPage,
      state: { from: isCurrentPage ? location.state?.from : location.pathname },
    });
  };

  return (
    <ListItem disablePadding ref={ref}>
      <ListItemButton onClick={() => handleClick(ntfcPt.cnctMoappScrnVal, ntfcPt.ntgtVal)}>
        <ListItemAvatar>
          <Badge
            color="warning"
            variant={ntfcPt.prcgYn === 'N' ? 'dot' : 'standard'}
            overlap="circular"
          >
            <Avatar sx={{ bgcolor: 'warning.light' }}>
              {NTFC_CRTN_CT_VAL.ASSIGN === ntfcPt.ntfcCrtnCtVal ? (
                <AssignmentIndOutlinedIcon />
              ) : NTFC_CRTN_CT_VAL.NOTICE === ntfcPt.ntfcCrtnCtVal ? (
                <AssignmentOutlinedIcon />
              ) : (
                <CircleNotificationsOutlinedIcon />
              )}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
              <Chip
                label={ntfcPt.ntfcTtlNm}
                sx={{
                  'height': 20,
                  'fontSize': 12,
                  'fontWeight': (theme) => theme.typography.fontWeightBold,
                  '& .MuiChip-label': { px: 1 },
                }}
              ></Chip>
              <Typography noWrap={true} variant="subtitle2" color="text.secondary">
                {dayjs(ntfcPt.ntfcDsptDtm, 'YYYYMMDDHHmmss').fromNow()}
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    mutate({
                      userId: ntfcPt.userId,
                      ntfcDsptDtm: ntfcPt.ntfcDsptDtm,
                      ntfcSno: ntfcPt.ntfcSno,
                    });
                  }}
                >
                  <ClearOutlinedIcon
                    fontSize="inherit"
                    sx={{ color: (theme) => theme.palette.grey[400] }}
                  />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    maxHeight: 48,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {ntfcPt.ntfcCtt}
                </Typography>
                {ntfcPt.bnrImgPathVal ? (
                  <img
                    width="40"
                    height="40"
                    src={ntfcPt.bnrImgPathVal}
                    alt={ntfcPt.ntfcTtlNm}
                    style={{ marginLeft: 'auto' }}
                  />
                ) : null}
              </Box>
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
});

export default React.memo(NotificationListItem);

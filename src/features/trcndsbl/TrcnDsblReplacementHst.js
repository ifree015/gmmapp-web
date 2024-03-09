import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import dayjs from 'dayjs';
import { useQuery } from '@common/queries/query';
import { fetchTrcnRplcHstList } from '@features/trcndsbl/trcnDsblAPI';
// import LoadingSpinner from '@components/LoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';

const CloseFab = styled(Fab)({
  position: 'sticky',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1,
});

export default function TrcnDsblReplacementHst({ open, onClose, stlmAreaCd, dsblAcptNo }) {
  const { data, isError, error, reset, refetch } = useQuery(
    ['fetchTrcnRplcHstList'],
    () => fetchTrcnRplcHstList({ stlmAreaCd, dsblAcptNo }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  return (
    <Dialog open={open} onClose={onClose} scroll="paper" fullWidth maxWidth="sm">
      {/* <LoadingSpinner open={isRefetching} /> */}
      <ErrorDialog open={isError} error={error} resetError={reset} />
      {!data ? null : (
        <React.Fragment>
          <DialogTitle
            sx={{
              bgcolor: 'warning.main',
              py: 1,
            }}
            color={(theme) => theme.palette.common.white}
          >
            교체 이력
          </DialogTitle>
          <DialogContent sx={{ position: 'relative', px: 0 }}>
            {data.data.length > 0 ? (
              <Timeline position="alternate">
                {data.data.map((trcnRplcHst, index) => (
                  <TimelineItem key={index} sx={{ py: 0.5 }}>
                    <TimelineOppositeContent sx={{ m: 'auto 0' }} color="text.secondary">
                      <Typography variant="body2">
                        {trcnRplcHst.updrName ?? trcnRplcHst.updrId}
                      </Typography>
                      <Typography variant="caption">
                        {dayjs(trcnRplcHst.updDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        variant="outlined"
                        color={
                          index === data.data.length - 1
                            ? 'secondary'
                            : index === 0
                            ? 'primary'
                            : 'grey'
                        }
                      >
                        {/* {trcnRplcHst.dvcDvsNm?.substr(0, 1)} */}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ m: 'auto 0' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: (theme) => theme.typography.fontWeightBold,
                          color: 'text.secondary',
                        }}
                      >
                        {trcnRplcHst.dvcDvsNm}
                      </Typography>
                      <Typography variant="body2">{trcnRplcHst.trcnId}</Typography>
                      <Typography variant="body2">{trcnRplcHst.stpTrcnId}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <Box sx={{ py: 1, px: 2 }}>
                <Alert severity="warning" sx={{ flexGrow: 1 }}>
                  교체 이력이 없습니다.
                </Alert>
              </Box>
            )}
            <CloseFab size="small" color="warning" aria-label="close" onClick={onClose}>
              <CloseOutlinedIcon />
            </CloseFab>
          </DialogContent>
        </React.Fragment>
      )}
    </Dialog>
  );
}

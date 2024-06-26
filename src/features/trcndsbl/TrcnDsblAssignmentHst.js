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
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import Fab from '@mui/material/Fab';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import dayjs from 'dayjs';
import { useQuery } from '@common/queries/query';
import { fetchAsgtEmpHstList } from '@features/trcndsbl/trcnDsblAPI';
// import LoadingSpinner from '@components/LoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';

const CloseFab = styled(Fab)({
  position: 'sticky',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1,
});

export default function TrcnDsblAssignmentHst({ open, onClose, stlmAreaCd, dsblAcptNo }) {
  const { data, isError, error, refetch } = useQuery(
    ['fetchAsgtEmpHstList'],
    () => fetchAsgtEmpHstList({ stlmAreaCd, dsblAcptNo }),
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
      <ErrorDialog open={isError} error={error} resetError={['fetchAsgtEmpHstList']} />
      {!data ? null : (
        <React.Fragment>
          <DialogTitle
            sx={{
              bgcolor: 'warning.main',
              py: 1,
            }}
            color={(theme) => theme.palette.common.white}
          >
            배정 이력
          </DialogTitle>
          <DialogContent sx={{ position: 'relative', px: 0 }}>
            <Timeline position="alternate">
              {data.data.map((asgtEmpHst, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary" sx={{ m: 'auto 0' }}>
                    <Typography variant="body2">
                      {asgtEmpHst.updrName ?? asgtEmpHst.updrId}
                    </Typography>
                    <Typography variant="caption">
                      {dayjs(asgtEmpHst.updDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        backgroundColor:
                          index === 0
                            ? 'secondary.main'
                            : index === data.data.length - 1
                            ? 'primary.main'
                            : asgtEmpHst.dsblPrcgPicId &&
                              asgtEmpHst.dsblPrcgPicId !== asgtEmpHst.dsblPrcgPicIdPrev
                            ? 'success.main'
                            : '',
                      }}
                    >
                      {asgtEmpHst.dsblPrcgPicId ? (
                        <AssignmentIndOutlinedIcon />
                      ) : (
                        <QuestionMarkOutlinedIcon />
                      )}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ m: 'auto 0' }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: (theme) => theme.typography.fontWeightBold,
                        color: 'text.secondary',
                      }}
                    >
                      {asgtEmpHst.dsblPrcgPicId &&
                      asgtEmpHst.dsblPrcgPicId !== asgtEmpHst.dsblPrcgPicIdPrev
                        ? asgtEmpHst.dsblPrcgPicName
                        : null}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            <CloseFab size="small" color="warning" aria-label="close" onClick={onClose}>
              <CloseOutlinedIcon />
            </CloseFab>
          </DialogContent>
        </React.Fragment>
      )}
    </Dialog>
  );
}

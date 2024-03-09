import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import { unescape } from 'html-escaper';
import useSmUp from '@common/hooks/useSmUp';

export default function TrcnDetailContentTab1({ trcnMvmnHsts }) {
  const isSmUp = useSmUp();
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {trcnMvmnHsts.map((trcnMvmnHst, index) => (
        <TimelineItem key={trcnMvmnHst.updDtm}>
          <TimelineSeparator>
            <TimelineDot color={index === 0 ? 'secondary' : 'grey'} />
            {index + 1 < trcnMvmnHsts.length ? <TimelineConnector /> : null}
          </TimelineSeparator>
          <TimelineContent
            sx={{
              maxWidth: (theme) =>
                isSmUp
                  ? `calc(${theme.breakpoints.values.sm}px - 48px - 28px)`
                  : 'calc(100vw - 32px - 28px)',
            }}
          >
            {/* <TimelineContent sx={{ pr: 0 }}> */}
            <Tooltip title={unescape(trcnMvmnHst.trcnModRsn ?? '')}>
              <ListItemText
                primary={unescape(trcnMvmnHst.trcnModRsn ?? '')}
                primaryTypographyProps={{
                  noWrap: true,
                  variant: 'subtitle2',
                }}
                secondary={dayjs(trcnMvmnHst.updDtm, 'YYYYMMDDHHmmss').format(
                  'YYYY.MM.DD HH:mm:ss'
                )}
                sx={{ mt: 0 }}
              />
            </Tooltip>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

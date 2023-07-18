import React, { useState, useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import ErrorDialog from '@components/ErrorDialog';
import useUser from '@common/hooks/useUser';
import { useQuery } from '@common/queries/query';
import { fetchSrchVhclList } from '@features/common/commonAPI';
import TrcnDsblVhclSearchStorage from './TrcnDsblVhclSearchStorage';
import TrcnDsblVhclSearchSuggestion from './TrcnDsblVhclSearchSuggestion';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function TrcnDsblVhclSearch({ open, onClose }) {
  const [srchKwd, setSrchKwd] = useState('');
  // const [isPending, startTransition] = useTransition();
  const user = useUser();

  const { data, isError, error, reset, refetch, remove } = useQuery(
    ['readSrchVhclList'],
    () => fetchSrchVhclList({ srchKwd }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
    }
  );

  const debouncedRefetch = useMemo(() => debounce(() => refetch(), 300), [refetch]);

  const handleChange = ({ target: { value } }) => {
    setSrchKwd(value);
    const trimmedValue = value.replace(/^\s+/, '');
    if (trimmedValue === '') {
      setSrchKwd(trimmedValue);
      if (srchKwd !== '') {
        debouncedRefetch.cancel();
        remove();
      }
    } else if (new RegExp('^[가-힣|a-z|A-Z|0-9|\\(|\\)| ]+$').test(trimmedValue)) {
      debouncedRefetch();
    }
  };

  // useEffect(() => {
  //   if (srchKwd.trim() !== '') {
  //     startTransition(() => {
  //       refetch();
  //     });
  //   }
  // }, [srchKwd, refetch]);

  const handleClose = useCallback(() => {
    remove();
    setSrchKwd('');
    onClose();
  }, [remove, onClose]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      scroll="paper"
    >
      <ErrorDialog open={isError} error={error} resetError={reset} />
      <Container
        disableGutters={true}
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          minHeight: '100vh',
          // overflowY: 'auto',
        }}
      >
        <Paper elevation={0}>
          <InputBase
            autoFocus
            fullWidth
            placeholder="차량번호 또는 운수사 차량번호."
            value={srchKwd}
            onChange={handleChange}
            sx={{ p: 1 }}
            startAdornment={
              <InputAdornment position="start">
                <IconButton aria-label="back" onClick={handleClose}>
                  <ArrowBackIcon />
                </IconButton>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  color="secondary"
                  aria-label="search"
                  component={RouterLink}
                  to={`/trcndsbl?dsblAcptDtDvs=3month&dsblAcptSttDt=${dayjs()
                    .subtract(3, 'month')
                    .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format('YYYYMMDD')}&dprtId=${
                    user.trcnDsblCentYn === 'Y' && !srchKwd.trim() ? user.dprtId : ''
                  }&dprtNm=${
                    user.trcnDsblCentYn === 'Y' && !srchKwd.trim() ? user.dprtNm : ''
                  }&srchKwd=${srchKwd.trim()}`}
                >
                  <SearchOutlinedIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <Divider sx={{ bgcolor: 'secondary.main' }} />
          {srchKwd === '' ? (
            <TrcnDsblVhclSearchStorage />
          ) : (
            <TrcnDsblVhclSearchSuggestion data={data} />
          )}
          <Divider />
          <Chip
            label="닫기"
            size="small"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
              ml: 1,
              my: 0.5,
            }}
            onClick={handleClose}
          />
        </Paper>
      </Container>
    </Dialog>
  );
}

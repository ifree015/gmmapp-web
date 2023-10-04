import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
// import useUser from '@common/hooks/useUser';
import { useQuery } from '@common/queries/query';
import { fetchSrchVhclList } from '@features/common/commonAPI';
import TrcnDsblVhclSearchStorage from './TrcnDsblVhclSearchStorage';
import TrcnDsblVhclSearchSuggestion from './TrcnDsblVhclSearchSuggestion';
import nativeApp from '@common/utils/nativeApp';

export default function TrcnDsblVhclSearchContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [srchKwd, setSrchKwd] = useState('');
  // const [isPending, startTransition] = useTransition();
  // const user = useUser();

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
    if (nativeApp.isIOS()) {
      nativeApp.goBack();
    } else {
      remove();
      setSrchKwd('');
      onClose();
    }
  }, [remove, onClose]);

  const handleSearch = useCallback(() => {
    //   &dprtId=${
    //   user.trcnDsblCentYn === 'Y' && !srchKwd.trim() ? user.dprtId : ''
    // }&dprtNm=${
    //   user.trcnDsblCentYn === 'Y' && !srchKwd.trim() ? user.dprtNm : ''}
    const to = `/trcndsbl?dsblAcptDtDvs=3month&dsblAcptSttDt=${dayjs()
      .subtract(3, 'month')
      .format('YYYYMMDD')}&dsblAcptEndDt=${dayjs().format('YYYYMMDD')}&srchKwd=${srchKwd.trim()}`;
    if (nativeApp.isIOS()) {
      nativeApp.pushView(to, { title: '단말기장애' });
    } else {
      navigate(to, { state: { from: location.pathname } });
    }
  }, [srchKwd, navigate, location]);

  return (
    <React.Fragment>
      <ErrorDialog open={isError} error={error} resetError={reset} />
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
                onClick={handleSearch}
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
    </React.Fragment>
  );
}

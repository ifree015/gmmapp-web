import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { debounce } from 'lodash';
import ErrorDialog from '@components/ErrorDialog';
import { useQuery } from '@common/queries/query';
import { fetchSrchTrcnList } from '@features/common/commonAPI';
import TrcnSearchStorage from './TrcnSearchStorage';
import TrcnSearchSuggestion from './TrcnSearchSuggestion';
import nativeApp from '@common/utils/nativeApp';

export default function TrcnSearchContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [srchKwd, setSrchKwd] = useState('');

  const { data, isError, error, refetch, remove } = useQuery(
    ['fetchSrchTrcnList'],
    () => fetchSrchTrcnList({ srchKwd }),
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
    const to = `/trcnprcn/trcn?srchKwd=${srchKwd.trim()}`;
    if (nativeApp.isIOS()) {
      nativeApp.pushView(to, { title: '단말기' });
    } else {
      navigate(to, { state: { from: location.pathname } });
    }
  }, [srchKwd, navigate, location]);

  return (
    <React.Fragment>
      <ErrorDialog open={isError} error={error} resetError={['fetchSrchTrcnList']} />
      <Paper elevation={0}>
        <InputBase
          autoFocus
          fullWidth
          placeholder="단말기 또는 차량번호 단말기."
          value={srchKwd}
          onChange={handleChange}
          sx={{ p: 1 }}
          startAdornment={
            <InputAdornment position="start">
              <IconButton aria-label="back" onClick={handleClose}>
                <ArrowBackOutlinedIcon />
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
        {srchKwd === '' ? <TrcnSearchStorage /> : <TrcnSearchSuggestion data={data} />}
        <Divider />
        <Chip
          label="닫기"
          size="small"
          sx={{
            backgroundColor: (theme) => theme.palette.background.color,
            ml: 1,
            my: 0.5,
          }}
          onClick={handleClose}
        />
      </Paper>
    </React.Fragment>
  );
}

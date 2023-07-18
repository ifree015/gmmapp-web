import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import produce from 'immer';
import { useInView } from 'react-intersection-observer';
import useSmUp from '@common/hooks/useSmUp';
import TrcnDsblSearchCondition from './TrcnDsblSearchCondition';

const StickyStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0, -2, 0, -2),
  padding: theme.spacing(1, 2),
  position: 'sticky',
  top: 56,
  // justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, -3, 0, -3),
    padding: theme.spacing(1, 3),
    top: 64,
    // justifyContent: 'flex-start',
  },
  flexWrap: 'wrap',
  zIndex: theme.zIndex.appBar + 1,
}));

const initialState = {
  searchCondition: false,
  sticky: undefined,
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'SEARCH_CONDITION':
        draft.searchCondition = action.payload;
        break;
      case 'STICKY':
        draft.sticky = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnDsblHeader() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const isSmUp = useSmUp();
  const [ref, inView] = useInView({
    threshold: 1,
    rootMargin: isSmUp ? '-65px 0px 0px 0px' : '-57px 0px 0px 0px',
  });

  const conditions = useMemo(() => {
    const conditions = [];
    searchParams.forEach((value, key) => {
      if (!value || key.endsWith('Nm')) return;
      switch (key) {
        case 'srchKwd':
          conditions.push({
            keys: [key],
            name: value,
            deletable: true,
            visible: true,
          });
          break;
        case 'dsblAcptDtDvs':
          conditions.push({
            keys: [key],
            name:
              value === '1month'
                ? '1개월'
                : value === '3month'
                ? '3개월'
                : value === '6month'
                ? '6개월'
                : value === '1year'
                ? '1년'
                : '',
            deletable: true,
            visible: false,
          });
          break;
        case 'dsblAcptSttDt':
          conditions.push({
            keys: ['dsblAcptSttDt', 'dsblAcptEndDt'],
            name:
              dayjs(searchParams.get('dsblAcptSttDt'), 'YYYYMMDD').format('YYYY.MM.DD') +
              '~' +
              dayjs(searchParams.get('dsblAcptEndDt'), 'YYYYMMDD').format('YYYY.MM.DD'),
            deletable: false,
            visible: true,
          });
          break;
        case 'dsblPrsrName':
          conditions.push({
            keys: [key],
            name: value,
            deletable: true,
            visible: true,
          });
          break;
        case 'stlmAreaCd':
        case 'troaId':
        case 'tropId':
        case 'dsblAcptDvsCd':
        case 'dprtId':
          conditions.push({
            keys: [key, key.substring(0, key.length - 2) + 'Nm'],
            name: searchParams.get(key.substring(0, key.length - 2) + 'Nm'),
            deletable: true,
            visible: true,
          });
          break;
        case 'vhclId':
          conditions.push({
            keys: [key, 'vhclNo'],
            name: searchParams.get('vhclNo'),
            deletable: true,
            visible: true,
          });
          break;
        case 'asgtYn':
          conditions.push({
            keys: [key],
            name: value === 'Y' ? '배정' : '오배정',
            deletable: true,
            visible: true,
          });
          break;
        case 'dsblPrcgFnYn':
          conditions.push({
            keys: [key],
            name: value === 'Y' ? '완료' : '미완료',
            deletable: true,
            visible: true,
          });
          break;
        case 'dsblPrcgSttDt':
          conditions.push({
            keys: ['dsblPrcgSttDt', 'dsblPrcgEndDt'],
            name:
              dayjs(searchParams.get('dsblPrcgSttDt'), 'YYYYMMDD').format('YYYY.MM.DD') +
              '~' +
              dayjs(searchParams.get('dsblPrcgEndDt'), 'YYYYMMDD').format('YYYY.MM.DD'),
            deletable: true,
            visible: true,
          });
          break;
        default:
          break;
      }
    });
    return conditions;
  }, [searchParams]);

  useEffect(() => {
    if (state.sticky === undefined) {
      dispatch({
        type: 'STICKY',
        payload: false,
      });
    } else {
      dispatch({
        type: 'STICKY',
        payload: !inView,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const handleDelete = (keys) => {
    keys.forEach((key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams, { replace: true });
  };

  const handleDeleteAll = () => {
    conditions.forEach((condition) => {
      if (!condition.deletable) return;
      condition.keys.forEach((key) => {
        searchParams.delete(key);
      });
    });
    setSearchParams(searchParams, { replace: true });
  };

  const closeSearchCondition = useCallback(() => {
    dispatch({
      type: 'SEARCH_CONDITION',
      payload: false,
    });
  }, []);

  return (
    <React.Fragment>
      <Paper elevation={0} sx={{ mx: { xs: -2, sm: -3 } }}>
        <InputBase
          fullWidth
          placeholder="차량번호 또는 운수사 차량번호."
          inputProps={{ readOnly: true }}
          sx={{ p: 1 }}
          onClick={() =>
            dispatch({
              type: 'SEARCH_CONDITION',
              payload: true,
            })
          }
          startAdornment={
            <InputAdornment position="start" sx={{ pl: 1 }}>
              <SearchOutlinedIcon />
            </InputAdornment>
          }
          endAdornment={
            conditions.length > 1 ? (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  aria-label="delete all"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteAll();
                  }}
                >
                  <ClearOutlinedIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }
        />
        <Divider />
      </Paper>
      <StickyStack
        direction="row"
        // spacing={{ xs: 0.5, sm: 1 }}
        sx={{
          bgcolor: state.sticky ? 'background.paper' : 'inherit',
        }}
        component="header"
        ref={ref}
      >
        {conditions
          .filter((condition) => condition.visible)
          .map((param) => (
            <Chip
              label={param.name}
              variant="filled"
              onDelete={param.deletable ? () => handleDelete(param.keys) : null}
              key={param.keys[0]}
              sx={{ fontSize: { xs: 12, sm: 13 }, mt: 0.5, mr: 0.5 }}
            ></Chip>
          ))}
      </StickyStack>
      <TrcnDsblSearchCondition open={state.searchCondition} onClose={closeSearchCondition} />
    </React.Fragment>
  );
}

import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Divider from '@mui/material/Divider';
import StickyStack from '@components/StickyStack';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import produce from 'immer';
import { useInView } from 'react-intersection-observer';
import DplcTrcnDsblSearchCondition from './DplcTrcnDsblSearchCondition';
import nativeApp from '@common/utils/nativeApp';

const initialState = {
  searchCondition: false,
  sticky: false,
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

export default function DplcTrcnDsblHeader() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [ref, inView] = useInView({
    threshold: 1,
    initialInView: true,
    rootMargin: `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`,
  });

  if (!searchParams.get('dsblAcptSttDt')) {
    searchParams.append('dsblAcptDtDvsCd', '3month');
    searchParams.append('dsblAcptSttDt', dayjs().subtract(3, 'month').format('YYYYMMDD'));
    searchParams.append('dsblAcptEndDt', dayjs().format('YYYYMMDD'));
    searchParams.append('acptNcnt', 2);
  }

  const conditions = useMemo(() => {
    const conditions = [];
    searchParams.forEach((value, key) => {
      if (!value || key.endsWith('Nm') || key.endsWith('No')) return;
      switch (key) {
        case 'srchKwd':
          conditions.push({
            keys: [key],
            name: value,
            deletable: true,
            visible: true,
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
        case 'stlmAreaCd':
        case 'troaId':
        case 'dsblAcptDvsCd':
        case 'busTrcnErrTypCd':
        case 'tropId':
          conditions.push({
            keys: [key, key.substring(0, key.length - 2) + 'Nm'],
            name: searchParams.get(key.substring(0, key.length - 2) + 'Nm'),
            deletable: true,
            visible: true,
          });
          break;
        case 'vhclId':
          conditions.push({
            keys: [key, key.substring(0, key.length - 2) + 'No'],
            name: searchParams.get(key.substring(0, key.length - 2) + 'No'),
            deletable: true,
            visible: true,
          });
          break;
        case 'acptNcnt':
          conditions.push({
            keys: [key, key],
            name: searchParams.get(key) + '건 이상',
            deletable: false,
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
    dispatch({
      type: 'STICKY',
      payload: !inView,
    });
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
          id="searchCondition"
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
            conditions.filter((condition) => condition.deletable).length > 1 ? (
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
          top: `${nativeApp.isIOS() ? 0 : 48}px`,
          flexWrap: 'wrap',
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
            />
          ))}
      </StickyStack>
      <DplcTrcnDsblSearchCondition
        open={state.searchCondition}
        onClose={closeSearchCondition}
        searchParams={searchParams}
      />
    </React.Fragment>
  );
}

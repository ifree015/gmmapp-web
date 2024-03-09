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
import produce from 'immer';
import { useInView } from 'react-intersection-observer';
import BusBsfcSearchCondition from './BusBsfcSearchCondition';
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

export default function BusBsfcHeader() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [ref, inView] = useInView({
    threshold: 1,
    initialInView: true,
    rootMargin: `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`,
  });

  const conditions = useMemo(() => {
    const conditions = [];
    searchParams.forEach((value, key) => {
      if (!value || key.endsWith('Nm')) return;
      switch (key) {
        case 'srchKwd':
          conditions.push({
            keys: [key],
            name: searchParams.get('srchKwd'),
            deletable: true,
            visible: true,
          });
          break;
        case 'stlmAreaCd':
        case 'troaId':
        case 'tropId':
        case 'dprtId':
          conditions.push({
            keys: [key, key.substring(0, key.length - 2) + 'Nm'],
            name: searchParams.get(key.substring(0, key.length - 2) + 'Nm'),
            deletable: true,
            visible: true,
          });
          break;
        // case 'busBsfcId':
        //   conditions.push({
        //     keys: [key, 'bsfcNm'],
        //     name: searchParams.get('bsfcNm'),
        //     deletable: true,
        //     visible: true,
        //   });
        //   break;
        case 'useYn':
          if (value !== 'A') {
            // 전체
            conditions.push({
              keys: [key],
              name: value === 'Y' ? '사용' : '미사용',
              deletable: true,
              visible: true,
            });
          }
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
      if (key === 'useYn') {
        searchParams.append('useYn', 'A');
      }
    });
    setSearchParams(searchParams, { replace: true });
  };

  const handleDeleteAll = () => {
    conditions.forEach((condition) => {
      if (!condition.deletable) return;
      condition.keys.forEach((key) => {
        searchParams.delete(key);
        if (key === 'useYn') {
          searchParams.append('useYn', 'A');
        }
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
          placeholder="영업소명 또는 운수사 영업소명."
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
      <BusBsfcSearchCondition
        open={state.searchCondition}
        onClose={closeSearchCondition}
        searchParams={searchParams}
      />
    </React.Fragment>
  );
}

import React, { useEffect, useReducer, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import TabPanel from '@components/TabPanel';
import produce from 'immer';
import SwipeableView from '@components/SwipeableView';
import TrcnDsblDetailContentHeader from './TrcnDsblDetailContentHeader';
import TrcnDsblDetailContentTab1 from './TrcnDsblDetailContentTab1';
import TrcnDsblDetailContentTab2 from './TrcnDsblDetailContentTab2';
import TrcnDsblDetailContentTab3 from './TrcnDsblDetailContentTab3';
import AlertSnackbar from '@components/AlertSnackbar';
import { useQuery } from '@common/queries/query';
import { fetchTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import nativeApp from '@common/utils/nativeApp';

function a11yProps(name, index) {
  return {
    'id': `${name}-tab-${index}`,
    'aria-controls': `${name}-tabpanel-${index}`,
  };
}

const initialState = {
  tabIndex: 0,
  cancelSnackbar: false,
  acceptStatus: 'idle',
  processStatus: 'idle',
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'TAB_SELECT':
        draft.tabIndex = action.payload;
        break;
      case 'CANCEL_SNACKBAR_OPEN':
        draft.cancelSnackbar = true;
        break;
      case 'CANCEL_SNACKBAR_CLOSE':
        draft.cancelSnackbar = false;
        break;
      case 'ACCEPT':
        draft.acceptStatus = action.payload;
        break;
      case 'PROCESS':
        draft.processStatus = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnDsblDetailContent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { stlmAreaCd, dsblAcptNo } = useParams();
  // const results = useQueries({
  //   queries: [
  //     {
  //       queryKey: ['readTrcnDsbl'],
  //       queryFn: () => fetchTrcnDsbl({ stlmAreaCd, dsblAcptNo }),
  //     },
  //     {
  //       queryKey: ['readDsblVhclTrcnList'],
  //       queryFn: () => fetchDsblVhclTrcnList({ stlmAreaCd, dsblAcptNo }),
  //     },
  //   ],
  // });

  const {
    data: { data: trcnDsbl },
    // remove,
  } = useQuery(
    ['readTrcnDsbl', stlmAreaCd, dsblAcptNo],
    () => fetchTrcnDsbl({ stlmAreaCd, dsblAcptNo }),
    {
      onSuccess: ({ data }) => {
        //setSnackbarOpen(data.dltYn !== 'Y');
      },
    }
  );

  const handleChangeTab = useCallback((event, value) => {
    dispatch({ type: 'TAB_SELECT', payload: value });
  }, []);

  const handleChangeIndex = useCallback((index) => {
    dispatch({ type: 'TAB_SELECT', payload: index });
  }, []);

  const otherCached = stlmAreaCd !== trcnDsbl.stlmAreaCd || dsblAcptNo !== trcnDsbl.dsblAcptNo;
  useEffect(() => {
    if (otherCached) return;
    // cachedRef.current = false;
    if (trcnDsbl.dltYn === 'Y') {
      // 다른 사람이 같은 시간에 삭제하면 cache된 것으로 판단하기 때문에 띄우지 못함
      dispatch({
        type: 'CANCEL_SNACKBAR_OPEN',
      });
    }
    // return () => {
    //   remove();
    // };
  }, [trcnDsbl.stlmAreaCd, trcnDsbl.dsblAcptNo, otherCached, trcnDsbl.dltYn]);

  const acceptFormRef = useRef();
  const handleAccept = useCallback(() => {
    acceptFormRef.current.handleSubmit();
  }, []);
  const changeAcceptStatus = useCallback((acceptStatus) => {
    dispatch({ type: 'ACCEPT', payload: acceptStatus });
  }, []);

  const processFormRef = useRef();
  const handleProcess = useCallback(() => {
    processFormRef.current.handleSubmit();
  }, []);
  const changeProcessStatus = useCallback((processStatus) => {
    dispatch({ type: 'PROCESS', payload: processStatus });
  }, []);

  useEffect(() => {
    if (otherCached || !trcnDsbl) return;
    nativeApp.setViewInfo({
      title: '단말기장애 상세',
      subTitle: `${trcnDsbl.vhclNo} - ${trcnDsbl.tropNm}`,
    });
  }, [otherCached, trcnDsbl]);

  return (
    <React.Fragment>
      <TrcnDsblDetailContentHeader
        trcnDsbl={trcnDsbl}
        tabIndex={state.tabIndex}
        acceptStatus={state.acceptStatus}
        onAccept={handleAccept}
        processStatus={state.processStatus}
        onProcess={handleProcess}
      />
      <Paper elevation={0} sx={{ mt: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={state.tabIndex} onChange={handleChangeTab} aria-label="trcndsbl tabs">
            <Tab label="장애 정보" {...a11yProps('trcndsbl', 0)} sx={{ fontWeight: 600 }} />
            <Tab label="처리 정보" {...a11yProps('trcndsbl', 1)} sx={{ fontWeight: 600 }} />
            <Tab label="단말기 정보" {...a11yProps('trcndsbl', 2)} sx={{ fontWeight: 600 }} />
          </Tabs>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ py: 1, pl: 2, borderTop: 1, borderColor: 'divider' }}
          >
            <Chip
              label={trcnDsbl.stlmAreaNm}
              color="secondary"
              sx={{
                'height': 20,
                'fontSize': 12,
                '& .MuiChip-label': { px: 1 },
              }}
            ></Chip>
            <Tooltip title={trcnDsbl.dprtNm ?? '오배정'}>
              <Chip
                label={trcnDsbl.dprtNm?.substring(0, 2) ?? '오배'}
                color={trcnDsbl.dprtNm ? 'secondary' : 'error'}
                sx={{
                  'height': 20,
                  'fontSize': 12,
                  '& .MuiChip-label': { px: 1 },
                }}
              ></Chip>
            </Tooltip>
            <Chip
              label={trcnDsbl.dsblAcptDvsNm}
              color="secondary"
              sx={{
                'height': 20,
                'fontSize': 12,
                '& .MuiChip-label': { px: 1 },
              }}
            ></Chip>
          </Stack>
        </Box>
        <SwipeableView index={state.tabIndex} onChangeIndex={handleChangeIndex}>
          <TabPanel name="trcndsbl" value={state.tabIndex} index={0} swipeable={true}>
            <TrcnDsblDetailContentTab1
              trcnDsbl={trcnDsbl}
              otherCached={otherCached}
              onChangeStatus={changeAcceptStatus}
              ref={acceptFormRef}
            />
          </TabPanel>
          <TabPanel name="trcndsbl" value={state.tabIndex} index={1} swipeable={true}>
            <TrcnDsblDetailContentTab2
              trcnDsbl={trcnDsbl}
              otherCached={otherCached}
              onChangeStatus={changeProcessStatus}
              ref={processFormRef}
            />
          </TabPanel>
          <TabPanel name="trcndsbl" value={state.tabIndex} index={2} swipeable={true}>
            <TrcnDsblDetailContentTab3
              trcnDsbl={trcnDsbl}
              stlmAreaCd={stlmAreaCd}
              dsblAcptNo={dsblAcptNo}
            />
          </TabPanel>
        </SwipeableView>
      </Paper>
      <AlertSnackbar
        open={state.cancelSnackbar}
        severity="warning"
        message="이미 취소된 건입니다!"
        onClose={() =>
          dispatch({
            type: 'CANCEL_SNACKBAR_CLOSE',
          })
        }
        autoHideDuration={3000}
        sx={{
          'maxWidth': (theme) => `calc(${theme.breakpoints.values.sm}px - 48px)`,
          '&.MuiSnackbar-root': { right: '8px' },
          // right: (theme) => (theme.breakpoints.up('sm') ? '8px' : 'auto'),
        }}
      />
    </React.Fragment>
  );
}

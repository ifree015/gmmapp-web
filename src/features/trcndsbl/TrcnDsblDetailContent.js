import React, { useEffect, useReducer, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
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
import PatchTooltip from '@components/PatchTooltip';
import ColorChip from '@components/ColorChip';

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
      case 'CANCEL_SNACKBAR':
        draft.cancelSnackbar = action.payload;
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

  const {
    data: { data: trcnDsbl },
  } = useQuery(['fetchTrcnDsbl', stlmAreaCd, dsblAcptNo], () =>
    fetchTrcnDsbl({ stlmAreaCd, dsblAcptNo })
  );

  // useEffect(() => {
  //   if (trcnDsbl.dltYn === 'Y') {
  //     dispatch({
  //       type: 'CANCEL_SNACKBAR', payload: true
  //     });
  //   }
  // }, [trcnDsbl]);

  const changeAcceptStatus = useCallback((acceptStatus) => {
    dispatch({ type: 'ACCEPT', payload: acceptStatus });
  }, []);
  const acceptFormRef = useRef();
  const handleAccept = useCallback(() => {
    acceptFormRef.current.handleSubmit();
  }, []);

  const changeProcessStatus = useCallback((processStatus) => {
    dispatch({ type: 'PROCESS', payload: processStatus });
  }, []);
  const processFormRef = useRef();
  const handleProcess = useCallback(() => {
    processFormRef.current.handleSubmit();
  }, []);

  const handleChangeTab = useCallback((event, value) => {
    dispatch({ type: 'TAB_SELECT', payload: value });
  }, []);

  const handleChangeIndex = useCallback((index) => {
    dispatch({ type: 'TAB_SELECT', payload: index });
  }, []);

  useEffect(() => {
    nativeApp.setViewInfo({
      title: '단말기장애 상세',
      subTitle: `${trcnDsbl.vhclNo} - ${trcnDsbl.tropNm}`,
    });
  }, [trcnDsbl]);

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
            <Tab
              label="접수 정보"
              {...a11yProps('trcndsbl', 0)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
            <Tab
              label="처리 정보"
              {...a11yProps('trcndsbl', 1)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
            <Tab
              label="단말기 정보"
              {...a11yProps('trcndsbl', 2)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
          </Tabs>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ py: 1, pl: 2, borderTop: 1, borderColor: 'divider' }}
          >
            <ColorChip label={trcnDsbl.stlmAreaNm} />
            <PatchTooltip title={trcnDsbl.dprtNm ?? '미배정'} enterTouchDelay={0}>
              <ColorChip
                label={trcnDsbl.dprtNm ? trcnDsbl.dprtNm.substring(0, 2) : '미배정'}
                color={trcnDsbl.dprtNm ? 'secondary' : 'error'}
              />
            </PatchTooltip>
            <ColorChip label={trcnDsbl.dsblAcptDvsNm} />
            <ColorChip
              color="warning"
              label={
                trcnDsbl.areaCd === '11'
                  ? trcnDsbl.busAreaNm.substring(0, 2)
                  : trcnDsbl.stlmAreaNm.substring(0, 2)
              }
            />
          </Stack>
        </Box>
        <SwipeableView index={state.tabIndex} onChangeIndex={handleChangeIndex}>
          <TabPanel name="trcndsbl" value={state.tabIndex} index={0} swipeable>
            <TrcnDsblDetailContentTab1
              trcnDsbl={trcnDsbl}
              onChangeStatus={changeAcceptStatus}
              ref={acceptFormRef}
            />
          </TabPanel>
          <TabPanel name="trcndsbl" value={state.tabIndex} index={1} swipeable>
            <TrcnDsblDetailContentTab2
              trcnDsbl={trcnDsbl}
              onChangeStatus={changeProcessStatus}
              ref={processFormRef}
            />
          </TabPanel>
          <TabPanel name="trcndsbl" value={state.tabIndex} index={2} swipeable>
            <TrcnDsblDetailContentTab3 trcnDsbl={trcnDsbl} />
          </TabPanel>
        </SwipeableView>
      </Paper>
      <AlertSnackbar
        open={state.cancelSnackbar}
        severity="warning"
        message="이미 취소된 건입니다!"
        onClose={() =>
          dispatch({
            type: 'CANCEL_SNACKBAR',
            payload: false,
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

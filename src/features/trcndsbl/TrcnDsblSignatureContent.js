import React, { useEffect, useReducer, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import SwipeableView from '@components/SwipeableView';
import TabPanel from '@components/TabPanel';
import produce from 'immer';
import { useQuery } from '@common/queries/query';
import { fetchTrcnDsblSgnList } from '@features/trcndsbl/trcnDsblAPI';
import ErrorDialog from '@components/ErrorDialog';
import TrcnDsblSignatureTab1 from './TrcnDsblSignatureTab1';
import TrcnDsblSignatureTab2 from './TrcnDsblSignatureTab2';

function a11yProps(name, index) {
  return {
    'id': `${name}-tab-${index}`,
    'aria-controls': `${name}-tabpanel-${index}`,
  };
}

const initialState = {
  tabIndex: 0,
  canvasStatus: 'idle', // init -> idle
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'TAB_SELECT':
        draft.tabIndex = action.payload;
        break;
      case 'CANVAS':
        draft.canvasStatus = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnDsblSignatureContent({ open = true, trcnDsbl }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    data: sgns,
    isError,
    error,
    refetch,
  } = useQuery(
    ['fetchTrcnDsblSgnList'],
    () =>
      fetchTrcnDsblSgnList({ stlmAreaCd: trcnDsbl.stlmAreaCd, dsblAcptNo: trcnDsbl.dsblAcptNo }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
    }
  );

  const handleChangeTab = useCallback((event, value) => {
    dispatch({ type: 'TAB_SELECT', payload: value });
  }, []);

  // const handleChangeIndex = useCallback((index) => {
  //   dispatch({ type: 'TAB_SELECT', payload: index });
  // }, []);

  useEffect(() => {
    if (open) {
      refetch();
      dispatch({ type: 'CANVAS', payload: 'init' });
    }
  }, [open, refetch]);

  useEffect(() => {
    if (state.canvasStatus === 'init') {
      dispatch({ type: 'CANVAS', payload: 'idle' });
    }
  }, [state.canvasStatus]);

  return (
    <React.Fragment>
      <ErrorDialog open={isError} error={error} resetError={['fetchTrcnDsblSgnList']} />
      <Paper elevation={0} sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            variant="fullWidth"
            value={state.tabIndex}
            onChange={handleChangeTab}
            // textColor="secondary"
            // indicatorColor="secondary"
            aria-label="signature tabs"
          >
            <Tab
              label="서명"
              {...a11yProps('signature', 0)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
            <Tab
              label="이력"
              {...a11yProps('signature', 1)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
          </Tabs>
        </Box>
        {/* <SwipeableView index={state.tabIndex} onChangeIndex={handleChangeIndex}> */}
        <TabPanel name="signature" value={state.tabIndex} index={0}>
          <TrcnDsblSignatureTab1
            trcnDsbl={trcnDsbl}
            sgns={sgns}
            canvasStatus={state.canvasStatus}
            refetch={refetch}
          />
        </TabPanel>
        <TabPanel name="signature" value={state.tabIndex} index={1}>
          <TrcnDsblSignatureTab2 trcnDsbl={trcnDsbl} sgns={sgns} refetch={refetch} />
        </TabPanel>
        {/* </SwipeableView> */}
      </Paper>
    </React.Fragment>
  );
}

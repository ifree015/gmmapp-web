import React, { useEffect, useReducer, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import ColorChip from '@components/ColorChip';
import TabPanel from '@components/TabPanel';
import produce from 'immer';
import SwipeableView from '@components/SwipeableView';
import VhclDetailContentHeader from './VhclDetailContentHeader';
import VhclDetailContentTab1 from './VhclDetailContentTab1';
import VhclDetailContentTab2 from './VhclDetailContentTab2';
import VhclDetailContentTab3 from './VhclDetailContentTab3';
import { useQuery } from '@common/queries/query';
import { fetchVhcl } from '@features/baseinf/baseInfAPI';
import nativeApp from '@common/utils/nativeApp';

function a11yProps(name, index) {
  return {
    'id': `${name}-tab-${index}`,
    'aria-controls': `${name}-tabpanel-${index}`,
  };
}

const initialState = {
  tabIndex: 0,
  updateStatus: 'idle',
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'TAB_SELECT':
        draft.tabIndex = action.payload;
        break;
      case 'UPDATE':
        draft.upateStatus = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function VhclDetailContent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tropId, vhclId } = useParams();

  const {
    data: { data: vhcl },
  } = useQuery(['fetchVhcl', tropId, vhclId], () => fetchVhcl({ tropId, vhclId }));

  const handleChangeTab = useCallback((event, value) => {
    dispatch({ type: 'TAB_SELECT', payload: value });
  }, []);

  const handleChangeIndex = useCallback((index) => {
    dispatch({ type: 'TAB_SELECT', payload: index });
  }, []);

  const changeUpdateStatus = useCallback((updateStatus) => {
    dispatch({ type: 'UPDATE', payload: updateStatus });
  }, []);
  const updateFormRef = useRef();
  const handleUpdate = useCallback(() => {
    updateFormRef.current.handleSubmit();
  }, []);

  useEffect(() => {
    nativeApp.setViewInfo({
      title: '차량 상세',
      subTitle: `${vhcl.vhclNo} - ${vhcl.tropNm}`,
    });
  }, [vhcl]);

  return (
    <React.Fragment>
      <VhclDetailContentHeader
        tabIndex={state.tabIndex}
        upateStatus={state.upateStatus}
        onUpdate={handleUpdate}
      />
      <Paper elevation={0} sx={{ mt: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={state.tabIndex} onChange={handleChangeTab} aria-label="vhcl tabs">
            <Tab
              label="차량상세"
              {...a11yProps('vhcl', 0)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
            <Tab
              label="설치단말기"
              {...a11yProps('vhcl', 1)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
            <Tab
              label="차량노선정보"
              {...a11yProps('vhcl', 2)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
          </Tabs>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ py: 1, pl: 2, borderTop: 1, borderColor: 'divider' }}
          >
            <ColorChip label={vhcl.stlmAreaNm} />
            <ColorChip label={vhcl.troaNm} />
            <ColorChip label={vhcl.useYn === 'Y' ? '사용' : '미사용'} color="warning" />
          </Stack>
        </Box>
        <SwipeableView index={state.tabIndex} onChangeIndex={handleChangeIndex}>
          <TabPanel name="vhcl" value={state.tabIndex} index={0} swipeable>
            <VhclDetailContentTab1
              vhcl={vhcl}
              onChangeStatus={changeUpdateStatus}
              ref={updateFormRef}
            />
          </TabPanel>
          <TabPanel name="vhcl" value={state.tabIndex} index={1} swipeable>
            <VhclDetailContentTab2 tropId={tropId} vhclId={vhclId} />
          </TabPanel>
          <TabPanel name="vhcl" value={state.tabIndex} index={2} swipeable>
            <VhclDetailContentTab3 vhcl={vhcl} />
          </TabPanel>
        </SwipeableView>
      </Paper>
    </React.Fragment>
  );
}

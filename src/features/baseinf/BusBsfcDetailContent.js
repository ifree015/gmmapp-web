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
import BusBsfcDetailContentHeader from './BusBsfcDetailContentHeader';
import BusBsfcDetailContentTab1 from './BusBsfcDetailContentTab1';
import BusBsfcDetailContentTab2 from './BusBsfcDetailContentTab2';
import { useQuery } from '@common/queries/query';
import { fetchBusBsfc } from '@features/baseinf/baseInfAPI';
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

export default function BusBsfcDetailContent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tropId, busBsfcId } = useParams();

  const {
    data: { data: busBsfc },
  } = useQuery(['fetchBusBsfc', tropId, busBsfcId], () => fetchBusBsfc({ tropId, busBsfcId }));

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
      title: '버스영업소 상세',
      subTitle: busBsfc.bsfcNm,
    });
  }, [busBsfc]);

  return (
    <React.Fragment>
      <BusBsfcDetailContentHeader
        tabIndex={state.tabIndex}
        upateStatus={state.upateStatus}
        onUpdate={handleUpdate}
      />
      <Paper elevation={0} sx={{ mt: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={state.tabIndex} onChange={handleChangeTab} aria-label="busbsfc tabs">
            <Tab
              label="영업소상세"
              {...a11yProps('busbsfc', 0)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
            <Tab
              label="영업소노선정보"
              {...a11yProps('busbsfc', 1)}
              sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
            />
          </Tabs>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ py: 1, pl: 2, borderTop: 1, borderColor: 'divider' }}
          >
            <ColorChip label={busBsfc.stlmAreaNm} />
            <ColorChip label={busBsfc.troaNm} />
            <ColorChip label={busBsfc.useYn === 'Y' ? '사용' : '미사용'} color="warning" />
          </Stack>
        </Box>
        <SwipeableView index={state.tabIndex} onChangeIndex={handleChangeIndex}>
          <TabPanel name="busBsfc" value={state.tabIndex} index={0} swipeable>
            <BusBsfcDetailContentTab1
              busBsfc={busBsfc}
              onChangeStatus={changeUpdateStatus}
              ref={updateFormRef}
            />
          </TabPanel>
          <TabPanel name="busBsfc" value={state.tabIndex} index={1} swipeable>
            <BusBsfcDetailContentTab2 busBsfc={busBsfc} />
          </TabPanel>
        </SwipeableView>
      </Paper>
    </React.Fragment>
  );
}

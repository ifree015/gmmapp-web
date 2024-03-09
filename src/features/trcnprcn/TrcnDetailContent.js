import React, { useEffect, useReducer, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
// import ShadowCard from '@components/ShadowCard';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import dayjs from 'dayjs';
import { useQuery } from '@common/queries/query';
import { fetchTrcn } from '@features/trcnprcn/trcnPrcnAPI';
import nativeApp from '@common/utils/nativeApp';
import produce from 'immer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@components/TabPanel';
import LabelValueListItem from '@components/LabelValueListItem';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SwipeableView from '@components/SwipeableView';
import TrcnDetailContentTab1 from './TrcnDetailContentTab1';
import TrcnDetailContentTab2 from './TrcnDetailContentTab2';
import ColorChip from '@components/ColorChip';

function a11yProps(name, index) {
  return {
    'id': `${name}-tab-${index}`,
    'aria-controls': `${name}-tabpanel-${index}`,
  };
}

const initialState = {
  tabIndex: 0,
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'TAB_SELECT':
        draft.tabIndex = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnDetailContent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { trcnId } = useParams();

  const {
    data: { data: trcn },
  } = useQuery(['fetchTrcn', trcnId], () => fetchTrcn({ trcnId }));

  const handleChangeTab = useCallback((event, value) => {
    dispatch({ type: 'TAB_SELECT', payload: value });
  }, []);

  const handleChangeIndex = useCallback((index) => {
    dispatch({ type: 'TAB_SELECT', payload: index });
  }, []);

  useEffect(() => {
    nativeApp.setViewInfo({
      title: '단말기 상세',
      subTitle: `${trcn.trcnId}(${trcn.intgTrcnStaNm})${trcn.vhclNo ? ` - ${trcn.vhclNo}` : ''}`,
    });
  }, [trcn]);

  return (
    <Stack spacing={1} sx={{ mt: 3 }}>
      <Card elevation={0}>
        <CardHeader
          title="단말기 정보"
          titleTypographyProps={{
            variant: 'subtitle1',
            fontWeight: (theme) => theme.typography.fontWeightBold,
          }}
        />
        <Divider sx={{ mx: 2 }} />
        <Stack direction="row" spacing={0.5} sx={{ py: 1, pl: 2 }}>
          <ColorChip label={trcn.intgAstsBzDvsNm} />
          <ColorChip label={trcn.prsLocNm} />
          <ColorChip label={trcn.intgTrcnStaNm} color="warning" />
        </Stack>
        <List aria-label="단말기 정보">
          <LabelValueListItem label="단말기ID" value={trcn.trcnId} />
          <LabelValueListItem label="장비제조사" value={trcn.eqpmMncrNm} />
          <LabelValueListItem label="단말기구분" value={trcn.trcnDvsNm} />
          <LabelValueListItem label="장비구분" value={trcn.eqpmDvsNm} />
          <LabelValueListItem label="장치구분" value={trcn.dvcDvsNm} />
          <LabelValueListItem label="정산지역" value={trcn.stlmAreaNm} />
          <LabelValueListItem
            label="교통사업자"
            value={trcn.tropId ? `${trcn.tropNm}(${trcn.tropId})` : ''}
          />
          <LabelValueListItem
            label="버스영업소"
            value={trcn.busBsfcId ? `${trcn.bsfcNm}(${trcn.busBsfcId})` : ''}
          />
          <LabelValueListItem
            label="차량번호"
            value={trcn.vhclId ? `${trcn.vhclNo}(${trcn.vhclId})` : ''}
          />
          <LabelValueListItem label="최종수정자" value={`${trcn.updrNm ?? ''}(${trcn.updrId})`} />
          <LabelValueListItem
            label="최종수정일시"
            value={dayjs(trcn.updDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
          />
        </List>
      </Card>
      <Card elevation={0}>
        <CardHeader
          title="단말기수신 정보"
          titleTypographyProps={{
            variant: 'subtitle1',
            fontWeight: (theme) => theme.typography.fontWeightBold,
          }}
        />
        <Divider sx={{ mx: 2 }} />
        <List aria-label="단말기수신 정보">
          <LabelValueListItem
            label="교통사업자"
            value={trcn.rcvTropId ? `${trcn.rcvTropNm}(${trcn.rcvTropId})` : ''}
          />
          <LabelValueListItem
            label="노선"
            value={trcn.rcvRotId ? `${trcn.rcvRotNm}(${trcn.rcvRotId})` : ''}
          />
          <LabelValueListItem
            label="버스영업소"
            value={trcn.rcvBusBsfcId ? `${trcn.rcvBsfcNm}(${trcn.rcvBusBsfcId})` : ''}
          />
          <LabelValueListItem
            label="차량번호"
            value={trcn.rcvVhclId ? `${trcn.rcvVhclNo}(${trcn.rcvVhclId})` : ''}
          />
          <LabelValueListItem label="MDN버전명" value={trcn.rcvMdnVerNm ?? ''} />
        </List>
      </Card>
      <Card elevation={0}>
        <CardHeader
          title="단말기이동 이력"
          titleTypographyProps={{
            variant: 'subtitle1',
            fontWeight: (theme) => theme.typography.fontWeightBold,
          }}
        />
        <Divider sx={{ mx: 2 }} />
        <Tabs
          value={state.tabIndex}
          onChange={handleChangeTab}
          aria-label="trcn tabs"
          sx={{ px: 2 }}
        >
          <Tab
            icon={<HistoryOutlinedIcon />}
            label="타임라인"
            {...a11yProps('trcn', 0)}
            sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
          />
          <Tab
            icon={<FeedOutlinedIcon />}
            label="이동이력"
            {...a11yProps('trcn', 1)}
            sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
          />
        </Tabs>
        <SwipeableView index={state.tabIndex} onChangeIndex={handleChangeIndex}>
          <TabPanel name="trcn" value={state.tabIndex} index={0} swipeable>
            <TrcnDetailContentTab1 trcnMvmnHsts={trcn.trcnMvmnHsts}></TrcnDetailContentTab1>
          </TabPanel>
          <TabPanel name="trcn" value={state.tabIndex} index={1} swipeable>
            <TrcnDetailContentTab2 trcnMvmnHsts={trcn.trcnMvmnHsts}></TrcnDetailContentTab2>
          </TabPanel>
        </SwipeableView>
      </Card>
    </Stack>
  );
}

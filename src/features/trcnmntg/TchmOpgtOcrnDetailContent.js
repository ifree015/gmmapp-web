import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import dayjs from 'dayjs';
import { useQuery } from '@common/queries/query';
import { fetchTchmOpgtOcrn } from '@features/trcnmntg/trcnMntgAPI';
import nativeApp from '@common/utils/nativeApp';
import LabelValueListItem from '@components/LabelValueListItem';
import ColorChip from '@components/ColorChip';

const numberFormat = new Intl.NumberFormat();
const fractionNumberFormat = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1 });
const fractionNumberFormat2 = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 });

export default function TchmOpgtOcrnDetailContent() {
  const { tropId, vhclId, drvrDrcsId, oprnDeprDtm } = useParams();

  const {
    data: { data: tchmOpgtOcrn },
  } = useQuery(['fetchTchmOpgtOcrn', tropId, vhclId, drvrDrcsId, oprnDeprDtm], () =>
    fetchTchmOpgtOcrn({ tropId, vhclId, drvrDrcsId, oprnDeprDtm })
  );

  useEffect(() => {
    nativeApp.setViewInfo({
      title: '타코개폐발생 상세',
      subTitle: `${tchmOpgtOcrn.vhclNo} - ${tchmOpgtOcrn.tropNm}`,
    });
  }, [tchmOpgtOcrn]);

  return (
    <Stack spacing={1} sx={{ mt: 3 }}>
      <Card elevation={0}>
        <CardHeader
          title="버스운행 정보"
          titleTypographyProps={{
            variant: 'subtitle1',
            fontWeight: (theme) => theme.typography.fontWeightBold,
          }}
        />
        <Divider sx={{ mx: 2 }} />
        <Stack direction="row" spacing={0.5} sx={{ py: 1, pl: 2 }}>
          <ColorChip label={tchmOpgtOcrn.stlmAreaNm} />
          <ColorChip label={tchmOpgtOcrn.troaNm} />
          <ColorChip label={tchmOpgtOcrn.drvrDrcsId} color="warning" />
        </Stack>
        <List aria-label="버스운행 정보">
          <LabelValueListItem
            label="교통사업자"
            value={`${tchmOpgtOcrn.tropNm}(${tchmOpgtOcrn.tropId})`}
          />
          <LabelValueListItem
            label="버스영업소"
            value={`${tchmOpgtOcrn.bsfcNm}(${tchmOpgtOcrn.busBsfcId})`}
          />
          <LabelValueListItem label="노선" value={`${tchmOpgtOcrn.rotNm}(${tchmOpgtOcrn.rotId})`} />
          <LabelValueListItem
            label="차량번호"
            value={`${tchmOpgtOcrn.vhclNo}(${tchmOpgtOcrn.vhclId})`}
          />
          <LabelValueListItem
            label="운행일시"
            value={`${dayjs(tchmOpgtOcrn.oprnDeprDtm, 'YYYYMMDDHHmmss').format(
              'YYYY.MM.DD HH:mm:ss'
            )} ~ ${dayjs(tchmOpgtOcrn.oprnEndDtm, 'YYYYMMDDHHmmss').format(
              'YYYY.MM.DD HH:mm:ss'
            )}(${numberFormat.format(tchmOpgtOcrn.oprnTime)}분)`}
          />
          <LabelValueListItem
            label="운전자"
            value={`${tchmOpgtOcrn.busDrvrNm ?? ''}(${tchmOpgtOcrn.busDrvrId})`}
          />
          <LabelValueListItem
            label="수집일자"
            value={dayjs(tchmOpgtOcrn.bizDt, 'YYYYMMDD').format('YYYY.MM.DD')}
          />
          <LabelValueListItem
            label="수집건수/금액"
            value={`${numberFormat.format(tchmOpgtOcrn.clcnNcnt)}건/${numberFormat.format(
              tchmOpgtOcrn.camt
            )}원`}
          />
        </List>
      </Card>
      <Card elevation={0}>
        <CardHeader
          title="버스이벤트 정보"
          titleTypographyProps={{
            variant: 'subtitle1',
            fontWeight: (theme) => theme.typography.fontWeightBold,
          }}
        />
        <Divider sx={{ mx: 2 }} />
        <List aria-label="버스이벤트 정보">
          <LabelValueListItem
            label="GPS건수(유효/비유효)"
            width={150}
            value={`${numberFormat.format(tchmOpgtOcrn.gpsVldNcnt)}/${numberFormat.format(
              tchmOpgtOcrn.gpsNvldNcnt
            )}(건)`}
          />
          <LabelValueListItem
            label="타코미터속도"
            width={150}
            value={`${fractionNumberFormat2.format(tchmOpgtOcrn.avrgTchmSpd)}km`}
          />
          <LabelValueListItem
            label="GPS속도"
            width={150}
            value={`${fractionNumberFormat2.format(tchmOpgtOcrn.avrgGpsSpd)}km`}
          />
          <LabelValueListItem
            label="속도비율(타코/GPS)"
            width={150}
            value={`${numberFormat.format(tchmOpgtOcrn.tchmSpdRto)}%`}
          />
          <LabelValueListItem
            label="개문시간(앞문/뒤문)"
            width={150}
            value={`${fractionNumberFormat.format(
              tchmOpgtOcrn.frdrOpgtDrtm / 60.0
            )}/${fractionNumberFormat.format(tchmOpgtOcrn.bcdrOpgtDrtm / 60.0)}(분)`}
          />
          <LabelValueListItem
            label="노선정류장수"
            width={150}
            value={`${numberFormat.format(tchmOpgtOcrn.rsstNum)}`}
          />
          <LabelValueListItem
            label="정류장(도착/출발)"
            width={150}
            value={`${numberFormat.format(tchmOpgtOcrn.bsstArvlNcnt)}/${numberFormat.format(
              tchmOpgtOcrn.bsstDeprNcnt
            )}(건)`}
          />
          <LabelValueListItem
            label="노선이탈"
            width={150}
            value={`${numberFormat.format(tchmOpgtOcrn.rotDfctNcnt)}건`}
          />
        </List>
      </Card>
    </Stack>
  );
}

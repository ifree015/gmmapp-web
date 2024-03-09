import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@common/queries/query';
import { fetchTrcnDsblList } from '@features/trcndsbl/trcnDsblAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import TrcnDsblListItem from './TrcnDsblListItem';
import useUser from '@common/hooks/useUser';
import dayjs from 'dayjs';

export default function TrcnDsblList() {
  const [searchParams] = useSearchParams();
  const [ref, inView] = useInView();
  const user = useUser();

  if (!searchParams.get('dsblAcptDtDvs')) {
    searchParams.append('dsblAcptDtDvs', '3month');
    searchParams.append('dsblAcptSttDt', dayjs().subtract(3, 'month').format('YYYYMMDD'));
    searchParams.append('dsblAcptEndDt', dayjs().format('YYYYMMDD'));
    searchParams.append('dprtId', user.isCenterUser() ? user.userInfo.dprtId : '');
    searchParams.append('dprtNm', user.isCenterUser() ? user.userInfo.dprtNm : '');
  }

  const queryParams = {
    srchKwd: searchParams.get('srchKwd') ?? '',
    dsblAcptSttDt: searchParams.get('dsblAcptSttDt'),
    dsblAcptEndDt: searchParams.get('dsblAcptEndDt'),
    stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
    troaId: searchParams.get('troaId') ?? '',
    dsblAcptDvsCd: searchParams.get('dsblAcptDvsCd') ?? '',
    busTrcnErrTypCd: searchParams.get('busTrcnErrTypCd') ?? '',
    tropId: searchParams.get('tropId') ?? '',
    busBsfcId: searchParams.get('busBsfcId') ?? '',
    vhclId: searchParams.get('vhclId') ?? '',
    dsblAcptNo: searchParams.get('dsblAcptNo') ?? '',
    asgtYn: searchParams.get('asgtYn') ?? '',
    dprtId: searchParams.get('dprtId') ?? '',
    dsblPrcgPicId: searchParams.get('dsblPrcgPicId') ?? '',
    dsblPrcgFnYn: searchParams.get('dsblPrcgFnYn') ?? '',
    prsrId: searchParams.get('prsrId') ?? '',
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['fetchTrcnDsblList'],
      ({ pageParam = 1 }) =>
        fetchTrcnDsblList({
          ...queryParams,
          rowsPerPage: 15,
          page: pageParam,
        }),
      {
        enabled: false,
        getNextPageParam: (lastPage) => {
          const nextPage = Number(lastPage.page) + 1;
          return nextPage <= Number(lastPage.total) ? nextPage : undefined;
        },
        //staleTime: 1 * 60 * 1000,
      }
    );

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  return (
    <React.Fragment>
      <ErrorDialog open={isError && !isFetchingNextPage} error={error} />
      <List
        sx={{ bgcolor: 'background.paper', mt: 1 }}
        subheader={
          <ListSubheader>
            <Typography variant="subtitle2" align="right" pt={0.25}>
              건수: {data ? new Intl.NumberFormat().format(data.pages[0].records) : 0}
            </Typography>
          </ListSubheader>
        }
      >
        {data?.pages.map((page, pageIndex) => {
          return page.data.map((trcnDsbl, index) => (
            <React.Fragment key={`${trcnDsbl.stlmAreaCd}-${trcnDsbl.dsblAcptNo}`}>
              {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
              <TrcnDsblListItem
                trcnDsbl={trcnDsbl}
                ref={
                  data.pages.length === pageIndex + 1 && page.data.length === index + 1 ? ref : null
                }
              ></TrcnDsblListItem>
            </React.Fragment>
          ));
        })}
        {data?.pages[0].records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              접수된 장애내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}

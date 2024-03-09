import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@common/queries/query';
import { fetchDplcTrcnDsblList } from '@features/trcndsbl/trcnDsblAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import DplcTrcnDsblListItem from './DplcTrcnDsblListItem';
import dayjs from 'dayjs';

export default function DplcTrcnDsblList() {
  const [searchParams] = useSearchParams();
  const [ref, inView] = useInView();

  if (!searchParams.get('dsblAcptSttDt')) {
    searchParams.append('dsblAcptSttDt', dayjs().subtract(3, 'month').format('YYYYMMDD'));
    searchParams.append('dsblAcptEndDt', dayjs().format('YYYYMMDD'));
    searchParams.append('acptNcnt', 2);
  }

  const queryParams = {
    srchKwd: searchParams.get('srchKwd') ?? '',
    dsblAcptSttDt: searchParams.get('dsblAcptSttDt'),
    dsblAcptEndDt: searchParams.get('dsblAcptEndDt'),
    stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
    troaId: searchParams.get('troaId') ?? '',
    dsblAcptDvsCd: searchParams.get('dsblAcptDvsCd') ?? '',
    busTrcnErrTypCd: searchParams.get('dsblAcptDvsCd') ?? '',
    tropId: searchParams.get('tropId') ?? '',
    vhclId: searchParams.get('vhclId') ?? '',
    acptNcnt: searchParams.get('acptNcnt') ?? 2,
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['fetchDplcTrcnDsblList'],
      ({ pageParam = 1 }) =>
        fetchDplcTrcnDsblList({
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
          <ListSubheader align="right">
            건수: {data ? new Intl.NumberFormat().format(data.pages[0].records) : 0}
          </ListSubheader>
        }
      >
        {data?.pages.map((page, pageIndex) => {
          return page.data.map((dplcTrcnDsbl, index) => (
            <React.Fragment
              key={`${dplcTrcnDsbl.tropId}-${dplcTrcnDsbl.vhclId}-${dplcTrcnDsbl.busTrcnErrTypCd}`}
            >
              {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
              <DplcTrcnDsblListItem
                dplcTrcnDsbl={dplcTrcnDsbl}
                dsblAcptSttDt={queryParams.dsblAcptSttDt}
                dsblAcptEndDt={queryParams.dsblAcptEndDt}
                ref={
                  data.pages.length === pageIndex + 1 && page.data.length === index + 1 ? ref : null
                }
              ></DplcTrcnDsblListItem>
            </React.Fragment>
          ));
        })}
        {data?.pages[0].records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              조회된 중복단말기장애내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}

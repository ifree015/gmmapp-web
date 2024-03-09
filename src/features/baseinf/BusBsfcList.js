import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@common/queries/query';
import { fetchBusBsfcList } from '@features/baseinf/baseInfAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import BusBsfcListItem from './BusBsfcListItem';

export default function BusBsfcList() {
  const [searchParams] = useSearchParams();
  const [ref, inView] = useInView();

  const queryParams = {
    srchKwd: searchParams.get('srchKwd') ?? '',
    stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
    troaId: searchParams.get('troaId') ?? '',
    tropId: searchParams.get('tropId') ?? '',
    busBsfcId: searchParams.get('busBsfcId') ?? '',
    dprtId: searchParams.get('dprtId') ?? '',
    useYn: searchParams.get('useYn') ?? 'Y',
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['fetchBusBsfcList'],
      ({ pageParam = 1 }) =>
        fetchBusBsfcList({
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
        // select: (data) => ({
        //   pages: data?.pages.flatMap((page) => page.data),
        //   records: data?.pages[0].records,
        //   pageParam: data.pageParam,
        // }),
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
          return page.data.map((busBsfc, index) => (
            <React.Fragment key={`${busBsfc.tropId}-${busBsfc.busBsfcId}`}>
              {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
              <BusBsfcListItem
                busBsfc={busBsfc}
                ref={
                  data.pages.length === pageIndex + 1 && page.data.length === index + 1 ? ref : null
                }
              ></BusBsfcListItem>
            </React.Fragment>
          ));
        })}
        {data?.pages[0].records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              조회된 버스영업소내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}

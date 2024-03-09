import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@common/queries/query';
import { fetchVhclList } from '@features/baseinf/baseInfAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import VhclListItem from './VhclListItem';

export default function VhclList() {
  const [searchParams] = useSearchParams();
  const [ref, inView] = useInView();

  const queryParams = {
    srchKwd: searchParams.get('srchKwd') ?? '',
    stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
    troaId: searchParams.get('troaId') ?? '',
    tropId: searchParams.get('tropId') ?? '',
    busBsfcId: searchParams.get('busBsfcId') ?? '',
    vhclId: searchParams.get('vhclId') ?? '',
    useYn: searchParams.get('useYn') ?? 'Y',
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['fetchVhclList'],
      ({ pageParam = 1 }) =>
        fetchVhclList({
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
        {data ? (
          data.pages.map((page, pageIndex) => {
            return page.data.map((vhcl, index) => (
              <React.Fragment key={`${vhcl.tropId}-${vhcl.vhclId}`}>
                {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
                <VhclListItem
                  vhcl={vhcl}
                  ref={
                    data.pages.length === pageIndex + 1 && page.data.length === index + 1
                      ? ref
                      : null
                  }
                ></VhclListItem>
              </React.Fragment>
            ));
          })
        ) : (
          <VhclListSkeleton />
        )}
        {data?.pages[0].records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              조회된 차량내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {data && isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}

function VhclListSkeleton() {
  return (
    <React.Fragment>
      {Array.from(new Array(15)).map((item, index) => (
        <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} animation="wave" />
          <Skeleton variant="rounted" width={'calc(100% - 56px)'} height={80} />
        </ListItem>
      ))}
    </React.Fragment>
  );
}

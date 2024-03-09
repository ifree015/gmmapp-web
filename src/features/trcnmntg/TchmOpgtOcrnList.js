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
import { fetchTchmOpgtOcrnList } from '@features/trcnmntg/trcnMntgAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import TchmOpgtOcrnListItem from './TchmOpgtOcrnListItem';

export default function TchmOpgtOcrnList() {
  const [searchParams] = useSearchParams();
  const [ref, inView] = useInView();

  const queryParams = {
    oprnSttDt: searchParams.get('oprnSttDt') ?? '',
    oprnEndDt: searchParams.get('oprnEndDt') ?? '',
    stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
    troaId: searchParams.get('troaId') ?? '',
    tropId: searchParams.get('tropId') ?? '',
    busBsfcId: searchParams.get('busBsfcId') ?? '',
    rotId: searchParams.get('rotId') ?? '',
    vhclId: searchParams.get('vhclId') ?? '',
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['fetchTchmOpgtOcrnList'],
      ({ pageParam = 1 }) =>
        fetchTchmOpgtOcrnList({
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
    if (queryParams.oprnSttDt) {
      refetch();
    }
  }, [searchParams, refetch, queryParams.oprnSttDt]);

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
            return page.data.map((tchmOpgtOcrn, index) => (
              <React.Fragment
                key={`${tchmOpgtOcrn.tropId}-${tchmOpgtOcrn.vhclId}-${tchmOpgtOcrn.drvrDrcsId}-${tchmOpgtOcrn.oprnDeprDtm}`}
              >
                {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
                <TchmOpgtOcrnListItem
                  tchmOpgtOcrn={tchmOpgtOcrn}
                  ref={
                    data.pages.length === pageIndex + 1 && page.data.length === index + 1
                      ? ref
                      : null
                  }
                ></TchmOpgtOcrnListItem>
              </React.Fragment>
            ));
          })
        ) : queryParams.oprnSttDt ? (
          <TchmOpgtOcrnListSkeleton />
        ) : null}
        {!queryParams.oprnSttDt ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              타코개폐발생내역을 검색해주세요!
            </Alert>
          </ListItem>
        ) : data?.pages[0].records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              조회된 타코개폐발생내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {data && isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}

function TchmOpgtOcrnListSkeleton() {
  return (
    <React.Fragment>
      {Array.from(new Array(15)).map((item, index) => (
        <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} animation="wave" />
          <Skeleton variant="rounted" width={'calc(100% - 56px)'} height={144} />
        </ListItem>
      ))}
    </React.Fragment>
  );
}

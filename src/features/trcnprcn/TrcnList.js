import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@common/queries/query';
import { fetchTrcnList } from '@features/trcnprcn/trcnPrcnAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import TrcnListItem from './TrcnListItem';

export default function TrcnList() {
  const [searchParams] = useSearchParams();
  const [ref, inView] = useInView();

  const queryParams = {
    srchKwd: searchParams.get('srchKwd') ?? '',
    intgAstsBzDvsCd: searchParams.get('intgAstsBzDvsCd') ?? '',
    prsLocId: searchParams.get('prsLocId') ?? '',
    trcnDvsCd: searchParams.get('trcnDvsCd') ?? '',
    eqpmDvsCd: searchParams.get('eqpmDvsCd') ?? '',
    dvcDvsCd: searchParams.get('dvcDvsCd') ?? '',
    intgTrcnStaCd: searchParams.get('intgTrcnStaCd') ?? '',
    tropId: searchParams.get('tropId') ?? '',
    vhclId: searchParams.get('vhclId') ?? '',
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['fetchTrcnList'],
      ({ pageParam = 1 }) =>
        fetchTrcnList({
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
          return page.data.map((trcn, index) => (
            <React.Fragment key={trcn.trcnId}>
              {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
              <TrcnListItem
                trcn={trcn}
                ref={
                  data.pages.length === pageIndex + 1 && page.data.length === index + 1 ? ref : null
                }
              ></TrcnListItem>
            </React.Fragment>
          ));
        })}
        {data?.pages[0].records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              조회된 단말기내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}

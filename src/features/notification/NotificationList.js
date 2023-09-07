import React, { useEffect, useCallback } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useInfiniteQuery, useMutation } from '@common/queries/query';
import { useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchNtfcPtList, updateNtfcPtPrcgYns } from '@features/notification/notificationAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import NotificationListItem from './NotificationListItem';

export default function NotificationList({ queryParams, onParentClose }) {
  const [ref, inView] = useInView();
  const queryClient = useQueryClient();

  const { mutate, reset } = useMutation(updateNtfcPtPrcgYns, {
    onError: (err) => {
      reset();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['readNewNtfcPtNcnt']);
    },
  });

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['readNtfcPtList', queryParams.categoryId],
      ({ pageParam = 1 }) =>
        fetchNtfcPtList({
          ...queryParams,
          rowsPerPage: 15,
          page: pageParam,
        }),
      {
        getNextPageParam: (lastPage) => {
          const nextPage = Number(lastPage.page) + 1;
          return nextPage <= Number(lastPage.total) ? nextPage : undefined;
        },
        onSuccess: (data) => {
          const ntfcPts = data.pages[data.pages.length - 1].data
            .filter((ntfcPt) => ntfcPt.prcgYn === 'N')
            .map((ntfcPt) => ({
              userId: ntfcPt.userId,
              ntfcDsptDtm: ntfcPt.ntfcDsptDtm,
              ntfcSno: ntfcPt.ntfcSno,
            }));
          if (ntfcPts.length > 0) {
            mutate({ ntfcPts: JSON.stringify({ ntfcPts: ntfcPts }) });
          }
        },
      }
    );

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(['readNtfcPtNcnt', queryParams.categoryId]);
    refetch();
  }, [queryClient, queryParams.categoryId, refetch]);

  return (
    <React.Fragment>
      <ErrorDialog open={isError && !isFetchingNextPage} error={error} />
      <List sx={{ bgcolor: 'background.paper', mt: 1.5 }}>
        {data.pages.map((page, pageIndex) => {
          return page.data.map((ntfcPt, index) => (
            <React.Fragment key={`${ntfcPt.userId}-${ntfcPt.ntfcDsptDtm}-${ntfcPt.ntfcSno}`}>
              {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
              <NotificationListItem
                ntfcPt={ntfcPt}
                refetchData={refetchData}
                onParentClose={onParentClose}
                ref={
                  data.pages.length === pageIndex + 1 && page.data.length === index + 1 ? ref : null
                }
              ></NotificationListItem>
            </React.Fragment>
          ));
        })}
        {data.pages[0]?.records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              알림내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}

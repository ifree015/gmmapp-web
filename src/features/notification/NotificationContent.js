import React, { useState, useMemo, Suspense } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import dayjs from 'dayjs';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import Copyright from '@features/common/Copyright';
import { NOTIFICATION_CATEGORY } from '@common/constants/appConstants';
import useUser from '@common/hooks/useUser';

export default function NotificationContent({ onClose }) {
  const [categoryId, setCategoryId] = useState(NOTIFICATION_CATEGORY.ALL.id);
  const { reset } = useQueryErrorResetBoundary();
  const user = useUser();
  const queryParams = useMemo(
    () => ({
      userId: user.userId,
      categoryId: categoryId,
      ntfcDsptDt: dayjs().subtract(1, 'month').format('YYYYMMDD'),
    }),
    [user.userId, categoryId]
  );

  return (
    <React.Fragment>
      <NotificationHeader queryParams={queryParams} changeCategoryId={setCategoryId} />
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorDialog open error={error} resetError={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<PartLoadingSpinner />}>
          <NotificationList queryParams={queryParams} onParentClose={onClose} />
        </Suspense>
      </ErrorBoundary>
      <Copyright />
    </React.Fragment>
  );
}

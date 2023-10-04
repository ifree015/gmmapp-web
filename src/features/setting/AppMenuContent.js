import React from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorDialog from '@components/ErrorDialog';
import Copyright from '@features/common/Copyright';
import MenuUserCard from './MenuUserCard';
import MenuMenuList from './MenuMenuList';
import MenuLogout from './MenuLogout';

export default function AppMenuContent({ onClose }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <React.Fragment>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
        )}
      >
        <MenuUserCard onParentClose={onClose} />
      </ErrorBoundary>
      <MenuMenuList onParentClose={onClose} />
      <MenuLogout />
      <Copyright sx={{ pt: 3, pb: 1 }} />
    </React.Fragment>
  );
}

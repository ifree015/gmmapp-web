import React, { Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from '@app/AppRoutes';
// import AnimationAppRoutes from '@app/AnimationAppRoutes';
// import { ThemeProvider } from '@mui/material/styles';
// import { theme } from '@app/theme';
import CssBaseline from '@mui/material/CssBaseline';
// import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingSpinner from '@components/LoadingSpinner';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ScrollToTop from '@components/ScrollToTop';
import ErrorDialog from '@components/ErrorDialog';
import GAlertDialog from '@components/GAlertDialog';
import GConfirmDialog from '@components/GConfirmDialog';
import GAlertSnackbar from '@components/GAlertSnackbar';
import GErrorDialog from '@components/GErrorDialog';
// import GlobalStyles from '@mui/material/GlobalStyles';
import './App.css';

function App() {
  // const theme = useTheme();

  return (
    // <ThemeProvider theme={theme}>
    <React.Fragment>
      <CssBaseline />
      {/* <GlobalStyles
        styles={{
          body: {
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          },
        }}
      /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            // <ErrorBoundary onReset={reset} FallbackComponent={ErrorDialog}>
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
              )}
            >
              <Suspense fallback={<LoadingSpinner open={true} />}>
                <Router>
                  <ScrollToTop />
                  {/* <AnimationAppRoutes /> */}
                  <AppRoutes />
                </Router>
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <GAlertDialog />
        <GConfirmDialog />
        <GAlertSnackbar />
        <GErrorDialog />
      </LocalizationProvider>
    </React.Fragment>
    // </ThemeProvider>
  );
}

export default App;

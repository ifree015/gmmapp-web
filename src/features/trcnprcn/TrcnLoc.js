import React, { useState, useCallback, useMemo, Suspense } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SubMainAppBar from '@features/common/SubMainAppBar';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import Copyright from '@features/common/Copyright';
import BottomNavBar from '@features/common/BottomNavBar';
import BackToTop from '@components/BackToTop';
import useUser from '@common/hooks/useUser';
import { useQuery } from '@common/queries/query';
import { fetchTrcnLocByNcnt } from '@features/trcnprcn/trcnPrcnAPI';
import TrcnLocCards from './TrcnLocCards';
import TrcnLocTable from './TrcnLocTable';
import TrcnSearchDialog from '@features/search/TrcnSearchDialog';

export default function TrcnLoc() {
  const { reset } = useQueryErrorResetBoundary();
  const [searchOpen, setSearchOpen] = useState(false);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, [setSearchOpen]);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      <SubMainAppBar title="단말기 위치" spaceHeight={1}>
        <IconButton color="inherit" aria-label="단말기검색" onClick={() => setSearchOpen(true)}>
          <SearchOutlinedIcon />
        </IconButton>
      </SubMainAppBar>
      <Container component="main" maxWidth="sm">
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <TrcnLocContent />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pt: 2 }} />
        <BackToTop bottomNavBar />
      </Container>
      <BottomNavBar currentNav="/trcnprcn/trcnloc" />
      <TrcnSearchDialog open={searchOpen} onClose={closeSearch} />
    </Box>
  );
}

function TrcnLocContent() {
  const user = useUser();

  const { data } = useQuery(
    ['fetchTrcnLocByNcnt'],
    () => fetchTrcnLocByNcnt({ locId: user.locId }),
    {
      select: ({ data }) => {
        return data;
      },
    }
  );

  const trcnLocs = useMemo(() => groupBy(data, 'prsLocId'), [data]);

  return (
    <React.Fragment>
      <TrcnLocCards trcnLocs={trcnLocs} />
      <TrcnLocTable trcnLocs={trcnLocs} />
    </React.Fragment>
  );
}

function groupBy(input, key) {
  return input.reduce((acc, currentValue) => {
    let groupKey = currentValue[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(currentValue);
    return acc;
  }, {});
}

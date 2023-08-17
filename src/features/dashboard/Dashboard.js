import { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MainAppBar from '@features/common/MainAppBar';
import Toolbar from '@mui/material/Toolbar';
import UserCard from './UserCard';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
// import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import { useMutation } from '@common/queries/query';
import TrcnDsblboard from './TrcnDsblboard';
import ElevationScroll from '@components/ElevationScroll';
import Copyright from '@features/common/Copyright';
import BottomNavBar from '@features/common/BottomNavBar';
import AppVerCheck from '@features/app/AppVerCheck';
import { fetchAutoLogin } from '@features/login/loginAPI';
import useAuth from '@common/hooks/useAuth';
import { login } from '@features/user/userSlice';
import useApp from '@common/hooks/useApp';
import { getLocalItem, setLocalItem } from '@common/utils/storage';
import nativeApp from '@common/utils/nativeApp';
import { APP_NAME } from '@common/constants/appConstants';
import LoadingSpinner from '@components/LoadingSpinner';

export default function Dashboard() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appInfo = useApp();
  const { reset } = useQueryErrorResetBoundary();
  // const [scrollTarget, setScrollTarget] = useState(undefined);

  const {
    mutate: autoLogin,
    isLoading: isAutoLoading,
    reset: mutateReset,
  } = useMutation(fetchAutoLogin, {
    useErrorBoundary: false,
    onError: (err) => {
      //mutateReset();
      //setLocalItem('remember', true);
      navigate('/login');
    },
    onSuccess: ({ data }) => {
      dispatch(login(data));
      setLocalItem('remember', true);
      if (nativeApp.isNativeApp()) {
        nativeApp.loggedIn(data);
      }
      mutateReset();
    },
  });

  useEffect(() => {
    if (!auth && getLocalItem('remember')) {
      if (nativeApp.isNativeApp() && !appInfo) return;
      setLocalItem('remember', false);
      autoLogin({ ...appInfo, moappNm: APP_NAME });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLogin, appInfo]);

  if (isAutoLoading) return <LoadingSpinner open={isAutoLoading} />;

  return (
    <Box>
      {/* <ElevationScroll target={scrollTarget}> */}
      <ElevationScroll>
        <MainAppBar />
      </ElevationScroll>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          minHeight: '100vh',
          overflow: 'auto',
          // height: '100vh',
        }}
        // ref={(node) => {
        //   if (node) {
        //     setScrollTarget(node);
        //   }
        // }}
        // className="no-scroll"
      >
        <Toolbar id="back-to-top-anchor" variant="dense" />
        <UserCard />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open={true} error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <TrcnDsblboard />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pb: 1 }} />
        {/* <BackToTop /> */}
      </Container>
      <BottomNavBar currentNav="/" />
      <AppVerCheck />
    </Box>
  );
}

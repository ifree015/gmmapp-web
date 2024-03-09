import { Suspense } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MainAppBar from '@features/common/MainAppBar';
// import Toolbar from '@mui/material/Toolbar';
import TrcnDsblDshUserCard from './TrcnDsblDshUserCard';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import BackToTop from '@components/BackToTop';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
// import { useMutation } from '@common/queries/query';
import TrcnDsblDshContent from './TrcnDsblDshContent';
// import ElevationScroll from '@components/ElevationScroll';
import Copyright from '@features/common/Copyright';
import BottomNavBar from '@features/common/BottomNavBar';
import AppVerCheck from '@features/app/AppVerCheck';
// import { fetchAutoLogin } from '@features/login/loginAPI';
// import useAuth from '@common/hooks/useAuth';
// import { login } from '@features/user/userSlice';
// import useApp from '@common/hooks/useApp';
// import { getLocalItem, setLocalItem } from '@common/utils/storage';
import nativeApp from '@common/utils/nativeApp';
// import LoadingSpinner from '@components/LoadingSpinner';

export default function TrcnDsblDsh() {
  // const auth = useAuth();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const appInfo = useApp();
  const { reset } = useQueryErrorResetBoundary();
  // const [scrollTarget, setScrollTarget] = useState(undefined);

  // const {
  //   mutate: autoLogin,
  //   isLoading: isAutoLoading,
  //   reset: mutateReset,
  // } = useMutation(fetchAutoLogin, {
  //   useErrorBoundary: false,
  //   onError: (err) => {
  //     //mutateReset();
  //     //setLocalItem('remember', true);
  //     navigate('/');
  //   },
  //   onSuccess: ({ data }) => {
  //     dispatch(login(data));
  //     setLocalItem('remember', true);
  //     if (nativeApp.isNativeApp()) {
  //       nativeApp.loggedIn(data);
  //     }
  //     mutateReset();
  //   },
  // });

  // useEffect(() => {
  //   if (!auth && getLocalItem('remember')) {
  //     if (nativeApp.isNativeApp() && !appInfo) return;
  //     setLocalItem('remember', false);
  //     autoLogin({ ...appInfo });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [autoLogin, appInfo]);

  // if (isAutoLoading) return <LoadingSpinner open={isAutoLoading} />;

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.color,
        minHeight: '100vh',
      }}
    >
      {/* <ElevationScroll target={scrollTarget}> */}
      <MainAppBar />
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          // backgroundColor: (theme) =>
          //   theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          // minHeight: '100vh',
          overflow: 'auto', // TODO('설정 하지 않을 경우 iOS에서 space 생김')
          // height: '100vh',
        }}
        // ref={(node) => {
        //   if (node) {
        //     setScrollTarget(node);
        //   }
        // }}
        // className="no-scroll"
      >
        <TrcnDsblDshUserCard />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorDialog open error={error} resetError={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PartLoadingSpinner />}>
            <TrcnDsblDshContent />
          </Suspense>
        </ErrorBoundary>
        <Copyright sx={{ pt: 3 }} />
        <BackToTop bottomNavBar />
      </Container>
      <BottomNavBar currentNav="/" />
      {nativeApp.isIOS() ? null : <AppVerCheck />}
    </Box>
  );
}

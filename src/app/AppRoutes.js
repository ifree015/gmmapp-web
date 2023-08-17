import { useEffect, useCallback, useContext } from 'react';
import { useRoutes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import useAuth from '@common/hooks/useAuth';
import Login from '@features/login/Login';
import Dashboard from '@features/dashboard/Dashboard';
import CentTrcnDsbl from '@features/trcndsbl/CentTrcnDsbl';
import TrcnDsbl from '@features/trcndsbl/TrcnDsbl';
import TrcnDsblDetail from '@features/trcndsbl/TrcnDsblDetail';
import NotFound from '@features/notfound/NotFound';
import { getLocalItem } from '@common/utils/storage';
import { ThemeModeContext } from '@app/ThemeMode';
import nativeApp from '@common/utils/nativeApp';

export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const themeMode = useContext(ThemeModeContext);

  const webViewHandler = useCallback(
    (event) => {
      //console.log(event.detail.data);
      const data = JSON.parse(event.detail.data);
      switch (data.eventType) {
        case 'theme':
          themeMode.setThemeMode(data.themeMode);
          themeMode.setPreferThemeMode(data.preferThemeMode);
          break;
        case 'navigate':
          if (data.toLocation === 'goBack') {
            if (location.state?.from) {
              navigate(-1);
            } else {
              navigate('/', { replace: true });
            }
          } else {
            const isCurrentPage = location.pathname === data.toLocation.split('?')[0];
            // location.pathname === data.toLocation.split('?')[0] ||
            // [location.pathname, data.toLocation].every((value) =>
            //   value.startsWith('/trcndsbl/trcndsbldetail')
            // );
            // console.log(location.pathname, data.toLocation, isCurrentPage);
            navigate(data.toLocation, {
              replace: isCurrentPage,
              state: { from: isCurrentPage ? location.state?.from : location.pathname },
            });
          }
          break;
        default:
          break;
      }
    },
    [themeMode, location, navigate]
  );

  useEffect(() => {
    window.addEventListener('webview', webViewHandler);

    return () => {
      window.removeEventListener('webview', webViewHandler);
    };
  }, [webViewHandler]);

  const element = useRoutes([
    {
      path: '/',
      element: (
        <RequireAuth autoLoginable={true}>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <RequireAuth autoLoginable={true}>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: '/centtrcndsbl',
      element: (
        <RequireAuth>
          <CentTrcnDsbl />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl',
      element: (
        <RequireAuth>
          <TrcnDsbl />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/trcndsbldetail/:stlmAreaCd/:dsblAcptNo',
      element: (
        <RequireAuth>
          <TrcnDsblDetail />
        </RequireAuth>
      ),
    },

    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return element;
}

function RequireAuth({ children, autoLoginable }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth) {
    if (autoLoginable && getLocalItem('remember')) {
      return children;
    } else {
      if (nativeApp.isIOS()) {
        nativeApp.loginView(location.pathname + (location.search ? `?${location.search}` : ''));
        return null;
      } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
        // window.open('#/login', '_blank');
        // return null;
      }
    }
  }

  return children;
}

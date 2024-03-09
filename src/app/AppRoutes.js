import { useEffect, useCallback, useContext } from 'react';
import { useRoutes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import useAuth from '@common/hooks/useAuth';
import Trop from '@features/baseinf/Trop';
import TropDetail from '@features/baseinf/TropDetail';
import BusBsfc from '@features/baseinf/BusBsfc';
import BusBsfcDetail from '@features/baseinf/BusBsfcDetail';
import Vhcl from '@features/baseinf/Vhcl';
import VhclDetail from '@features/baseinf/VhclDetail';
import TrcnLoc from '@features/trcnprcn/TrcnLoc';
import TrcnLocDetail from '@features/trcnprcn/TrcnLocDetail';
import Trcn from '@features/trcnprcn/Trcn';
import TrcnDetail from '@features/trcnprcn/TrcnDetail';
import TrcnSearch from '@features/search/TrcnSearch';
import TrcnDsblDsh from '@features/trcndsbl/TrcnDsblDsh';
import Notification from '@features/notification/Notification';
import TrcnDsblVhclSearch from '@features/search/TrcnDsblVhclSearch';
import AppMenu from '@features/setting/AppMenu';
import AppSetting from '@features/setting/AppSetting';
import CentTrcnDsbl from '@features/trcndsbl/CentTrcnDsbl';
import TrcnDsbl from '@features/trcndsbl/TrcnDsbl';
import TrcnDsblRgt from '@features/trcndsbl/TrcnDsblRgt';
import TrcnDsblDetail from '@features/trcndsbl/TrcnDsblDetail';
import TrcnDsblSignature from '@features/trcndsbl/TrcnDsblSignature';
import DplcTrcnDsbl from '@features/trcndsbl/DplcTrcnDsbl';
import TchmOpgtOcrn from '@features/trcnmntg/TchmOpgtOcrn';
import TchmOpgtOcrnDetail from '@features/trcnmntg/TchmOpgtOcrnDetail';
import Login from '@features/login/Login';
import NotFound from '@features/error/NotFound';
// import { getLocalItem } from '@common/utils/storage';
import { ThemeModeContext } from '@app/ThemeMode';
import nativeApp from '@common/utils/nativeApp';
// import usePushNotification from '@common/hooks/usePushNotification';

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
      path: '/baseinf/trop',
      element: (
        <RequireAuth>
          <Trop />
        </RequireAuth>
      ),
    },
    {
      path: '/baseinf/trop/:tropId',
      element: (
        <RequireAuth>
          <TropDetail />
        </RequireAuth>
      ),
    },
    {
      path: '/baseinf/busbsfc',
      element: (
        <RequireAuth>
          <BusBsfc />
        </RequireAuth>
      ),
    },
    {
      path: '/baseinf/busbsfc/:tropId/:busBsfcId',
      element: (
        <RequireAuth>
          <BusBsfcDetail />
        </RequireAuth>
      ),
    },
    {
      path: '/baseinf/vhcl',
      element: (
        <RequireAuth>
          <Vhcl />
        </RequireAuth>
      ),
    },
    {
      path: '/baseinf/vhcl/:tropId/:vhclId',
      element: (
        <RequireAuth>
          <VhclDetail />
        </RequireAuth>
      ),
    },
    {
      path: '/trcnprcn/trcnloc',
      element: (
        <RequireAuth>
          <TrcnLoc />
        </RequireAuth>
      ),
    },
    {
      path: '/trcnprcn/trcnloc/:prsLocId',
      element: (
        <RequireAuth>
          <TrcnLocDetail />
        </RequireAuth>
      ),
    },
    {
      path: '/trcnprcn/trcn',
      element: (
        <RequireAuth>
          <Trcn />
        </RequireAuth>
      ),
    },
    {
      path: '/trcnprcn/trcn/:trcnId',
      element: (
        <RequireAuth>
          <TrcnDetail />
        </RequireAuth>
      ),
    },
    {
      path: '/search/trcnsearch',
      element: (
        <RequireAuth nativePath>
          <TrcnSearch />
        </RequireAuth>
      ),
    },
    {
      path: '/',
      element: (
        <RequireAuth>
          <TrcnDsblDsh />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/trcndsbldsh',
      element: (
        <RequireAuth>
          <TrcnDsblDsh />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/centtrcndsbl',
      element: (
        <RequireAuth>
          <CentTrcnDsbl />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/trcndsbl',
      element: (
        <RequireAuth>
          <TrcnDsbl />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/trcndsbl/trcndsblrgt',
      element: (
        <RequireAuth>
          <TrcnDsblRgt />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/trcndsbl/:stlmAreaCd/:dsblAcptNo',
      element: (
        <RequireAuth>
          <TrcnDsblDetail />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/trcndsbl/:stlmAreaCd/:dsblAcptNo/trcndsblsgn',
      element: (
        <RequireAuth>
          <TrcnDsblSignature />
        </RequireAuth>
      ),
    },
    {
      path: '/trcndsbl/dplctrcndsbl',
      element: (
        <RequireAuth>
          <DplcTrcnDsbl />
        </RequireAuth>
      ),
    },
    {
      path: '/search/trcndsblvhclsearch',
      element: (
        <RequireAuth nativePath>
          <TrcnDsblVhclSearch />
        </RequireAuth>
      ),
    },
    {
      path: '/notification/notification',
      element: (
        <RequireAuth nativePath>
          <Notification />
        </RequireAuth>
      ),
    },
    {
      path: '/setting/menu',
      element: (
        <RequireAuth nativePath>
          <AppMenu />
        </RequireAuth>
      ),
    },
    {
      path: '/setting/setting',
      element: (
        <RequireAuth>
          <AppSetting />
        </RequireAuth>
      ),
    },
    {
      path: '/trcnmntg/tchmopgtocrn',
      element: (
        <RequireAuth>
          <TchmOpgtOcrn />
        </RequireAuth>
      ),
    },
    {
      path: '/trcnmntg/tchmopgtocrn/:tropId/:vhclId/:drvrDrcsId/:oprnDeprDtm',
      element: (
        <RequireAuth>
          <TchmOpgtOcrnDetail />
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

function RequireAuth({ children, nativePath }) {
  const auth = useAuth();
  const location = useLocation();
  // usePushNotification();

  if (!auth) {
    // if (autoLoginable && getLocalItem('remember')) {
    //   return children;
    // } else {
    if (nativeApp.isIOS()) {
      if (nativePath) {
        nativeApp.loginView('/');
      } else {
        nativeApp.loginView(location.pathname + (location.search ? `?${location.search}` : ''));
      }
      return null;
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
      // window.open('#/login', '_blank');
      // return null;
    }
    // }
  }

  return children;
}

import { useSelector, useDispatch } from 'react-redux';
import { selectApp, setApp } from '@features/app/appSlice';
import { getSessionItem } from '@common/utils/storage';
import nativeApp from '@common/utils/nativeApp';

const useApp = () => {
  let appInfo = useSelector(selectApp);
  const dispatch = useDispatch();
  if (nativeApp.isNativeApp() && !appInfo) {
    appInfo = getSessionItem('appInfo');
    if (appInfo) {
      dispatch(setApp(appInfo));
    } else {
      if (nativeApp.isAsync()) {
        (async () => {
          appInfo = await nativeApp.getAppInfo();
          dispatch(setApp(appInfo));
        })();
      } else {
        appInfo = nativeApp.getAppInfo();
        dispatch(setApp(appInfo));
      }
    }
  }

  return appInfo;
};

export default useApp;

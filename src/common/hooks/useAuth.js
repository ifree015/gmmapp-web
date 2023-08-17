import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, login } from '@features/user/userSlice';
import { getSessionItem, setSessionItem } from '@common/utils/storage';
import nativeApp from '@common/utils/nativeApp';

const useAuth = () => {
  let auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  if (nativeApp.isNativeApp() && !auth) {
    const userInfo = getSessionItem('userInfo');
    // console.log(userInfo);
    if (userInfo) {
      dispatch(login(userInfo));
      setSessionItem('userInfo', null);
      return true;
    }
  }

  return auth;
};

export default useAuth;

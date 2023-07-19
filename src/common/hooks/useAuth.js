import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, login } from '@features/user/userSlice';
import { getSessionItem } from '@common/utils/storage';

const useAuth = () => {
  let auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  if (!auth) {
    const userInfo = getSessionItem('userInfo');
    if (userInfo) {
      console.log(userInfo.userId);
      dispatch(login(userInfo));
      return true;
    }
  }

  return auth;
};

export default useAuth;

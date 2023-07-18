import { useSelector } from 'react-redux';
import { selectAuth } from '@features/user/userSlice';

const useAuth = () => useSelector(selectAuth);

export default useAuth;

import { useSelector } from 'react-redux';
import { selectUser } from '@features/user/userSlice';

const useUser = () => useSelector(selectUser);

export default useUser;

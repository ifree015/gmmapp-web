import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@features/user/userSlice';

class User {
  constructor(user) {
    for (const [key, value] of Object.entries(user)) {
      this[key] = value;
    }
  }

  isCenterUser() {
    return this.trcnDsblCentYn === 'Y';
  }
}

const useUser = () => {
  const user = useSelector(selectUser);
  const memoUser = useMemo(() => {
    return new User(user);
  }, [user]);

  return memoUser;
};

export default useUser;

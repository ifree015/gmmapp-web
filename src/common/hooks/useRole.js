import useUser from './useUser';
import { USER_ROLE } from '@common/constants/appConstants';

const useRole = () => {
  const user = useUser();
  if (user.asDutyId === '002') {
    return USER_ROLE.MANAGER;
  } else if (user.asDutyId !== '001' && user.trcnDsblCentYn === 'Y') {
    return USER_ROLE.STAFF;
  }
  return USER_ROLE.SELECTOR;
};

export default useRole;

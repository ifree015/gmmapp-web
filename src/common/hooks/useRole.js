import { useMemo } from 'react';
import useUser from '@common/hooks/useUser';
import { USER_ROLE } from '@common/constants/appConstants';

class UserRole {
  constructor(user) {
    this.user = user;
  }

  isAdmin() {
    return this.isinRoles(USER_ROLE.ADMIN);
  }

  isManager() {
    return this.isinRoles(USER_ROLE.MANAGER);
  }

  isCenterLeader() {
    return this.isinRoles(USER_ROLE.CENTER);
  }

  isStaff() {
    return this.isinRoles(USER_ROLE.STAFF);
  }

  isSelector() {
    //return this.user.sysAthtDvvl.indexOf(USER_ROLE.SELECTOR.id) >= 0;
    return this.isNotInRoles([
      USER_ROLE.ADMIN,
      USER_ROLE.MANAGER,
      USER_ROLE.CENTER,
      USER_ROLE.STAFF,
    ]);
  }

  getFistRoleName() {
    return this.getRoles()[0].name;
  }

  getRoles() {
    return this.user.sysAthtDvvl.split('|').map((roleId) => USER_ROLE.getRole(roleId));
    //.filter(Boolean);
  }

  isinRoles(roles) {
    return roles.some((role) => {
      return this.user.sysAthtDvvl.indexOf(role.id) >= 0;
    });
  }

  isNotInRoles(roles) {
    return roles.every((role) => {
      return this.user.sysAthtDvvl.indexOf(role.id) < 0;
    });
  }
}

const useRole = () => {
  const user = useUser();
  const memoUser = useMemo(() => {
    return new UserRole(user);
  }, [user]);

  return memoUser;
};

export default useRole;

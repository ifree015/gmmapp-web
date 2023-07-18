import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchLogin = (queryParams) => {
  return fetchByFormUrlencoded('user/Login.ajax', queryParams);
};

export const fetchAutoLogin = (queryParams) => {
  return fetchByFormUrlencoded('user/AutoLogin.ajax', queryParams);
};

export const processLogout = () => {
  return fetchByFormUrlencoded('user/Logout.ajax', {});
};

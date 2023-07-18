import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchLstAppVer = (queryParams) => {
  return fetchByFormUrlencoded('app/ReadLstAppVer.ajax', queryParams);
};

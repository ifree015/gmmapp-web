import { fetchByFormUrlencoded } from '@/common/api/api';

export const updatePushRcvYn = (queryParams) => {
  return fetchByFormUrlencoded('user/UpdatePushRcvYn.ajax', queryParams);
};

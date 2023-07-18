import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchCommonCode = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadGmmCmnCdList.ajax', queryParams);
};

export const fetchSrchTropList = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadSrchTropList.ajax', queryParams);
};

export const fetchSrchVhclList = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadSrchVhclList.ajax', queryParams);
};

import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchTrcnLocByNcnt = (queryParams) => {
  return fetchByFormUrlencoded('trcnprcn/ReadTrcnLocByNcnt.ajax', queryParams);
};

export const fetchTrcnLocNcnt = (queryParams) => {
  return fetchByFormUrlencoded('trcnprcn/ReadTrcnLocNcnt.ajax', queryParams);
};

export const fetchTrcnList = (queryParams) => {
  return fetchByFormUrlencoded('trcnprcn/ReadTrcnList.ajax', queryParams);
};

export const fetchTrcn = (queryParams) => {
  return fetchByFormUrlencoded('trcnprcn/ReadTrcn.ajax', queryParams);
};

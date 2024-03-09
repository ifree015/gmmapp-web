import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchTchmOpgtOcrnList = (queryParams) => {
  return fetchByFormUrlencoded('trcnmntg/ReadTchmOpgtOcrnList.ajax', queryParams);
};

export const fetchTchmOpgtOcrn = (queryParams) => {
  return fetchByFormUrlencoded('trcnmntg/ReadTchmOpgtOcrn.ajax', queryParams);
};

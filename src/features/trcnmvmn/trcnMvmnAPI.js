import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchVhclTrcnList = (queryParams) => {
  return fetchByFormUrlencoded('trcnmvmn/ReadVhclTrcnList.ajax', queryParams);
};

export const fetchStpPsbTrcnList = (queryParams) => {
  return fetchByFormUrlencoded('trcnmvmn/ReadStpPsbTrcnList.ajax', queryParams);
};

export const fetchChcStpPsbTrcnList = (queryParams) => {
  return fetchByFormUrlencoded('trcnmvmn/ReadChcStpPsbTrcnList.ajax', queryParams);
};

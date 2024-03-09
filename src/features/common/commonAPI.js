import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchCommonCode = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadGmmCmnCdList.ajax', queryParams);
};

export const fetchSrchTropList = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadSrchTropList.ajax', queryParams);
};

export const fetchSrchBusRotList = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadSrchBusRotList.ajax', queryParams);
};

export const fetchSrchBusBsfcList = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadSrchBusBsfcList.ajax', queryParams);
};

export const fetchSrchVhclList = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadSrchVhclList.ajax', queryParams);
};

export const fetchSrchTrcnList = (queryParams) => {
  return fetchByFormUrlencoded('common/ReadSrchTrcnList.ajax', queryParams);
};

import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchNewNtfcPtNcnt = (queryParams) => {
  return fetchByFormUrlencoded('ntfc/ReadNewNtfcPtNcnt.ajax', queryParams);
};

export const fetchNtfcPtNcnt = (queryParams) => {
  return fetchByFormUrlencoded('ntfc/ReadNtfcPtNcnt.ajax', queryParams);
};

export const deleteAllNtfcPt = (queryParams) => {
  return fetchByFormUrlencoded('ntfc/DeleteAllNtfcPt.ajax', queryParams);
};

export const fetchNtfcPtList = (queryParams) => {
  return fetchByFormUrlencoded('ntfc/ReadNtfcPtList.ajax', queryParams);
};

export const updateNtfcPtPrcgYn = (queryParams) => {
  return fetchByFormUrlencoded('ntfc/UpdateNtfcPtPrcgYn.ajax', queryParams);
};

export const deleteNtfcPt = (queryParams) => {
  return fetchByFormUrlencoded('ntfc/DeleteNtfcPt.ajax', queryParams);
};

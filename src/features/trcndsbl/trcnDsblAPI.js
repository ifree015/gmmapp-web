import { fetchByFormUrlencoded, fetchByFormData } from '@/common/api/api';

export const fetchTrcnDsblNcnt = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadTrcnDsblNcnt.ajax', queryParams);
};

export const fetchCentTrcnDsblNcnt = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadCentTrcnDsblNcnt.ajax', queryParams);
};

export const fetchCentTrcnDsblList = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadCentTrcnDsblList.ajax', queryParams);
};

export const fetchTrcnDsbl = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadTrcnDsbl.ajax', queryParams);
};

export const cancelTrcnDsbl = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/CancelTrcnDsbl.ajax', queryParams);
};

export const acceptTrcnDsbl = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/AcceptTrcnDsbl.ajax', queryParams);
};

export const fetchAsgtEmpHstList = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadAsgtEmpHstList.ajax', queryParams);
};

export const fetchTrcnRplcInf = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadTrcnRplcInf.ajax', queryParams);
};

export const processTrcnDsbl = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ProcessTrcnDsbl.ajax', queryParams);
};

export const fetchDsblVhclTrcnList = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadDsblVhclTrcnList.ajax', queryParams);
};

export const replaceDsblTrcn = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReplaceDsblTrcn.ajax', queryParams);
};

export const fetchTrcnRplcHstList = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadTrcnRplcHstList.ajax', queryParams);
};

export const addTrcnDsblSgn = (queryParams) => {
  return fetchByFormData('trcndsbl/AddTrcnDsblSgn.ajax', queryParams);
};

export const fetchTrcnDsblSgnList = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadTrcnDsblSgnList.ajax', queryParams);
};

export const deleteTrcnDsblSgn = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/DeleteTrcnDsblSgn.ajax', queryParams);
};

export const fetchTrcnDsblList = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadTrcnDsblList.ajax', queryParams);
};

export const fetchTrcnDsblPrcgNcnt = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadTrcnDsblPrcgNcnt.ajax', queryParams);
};

export const fetchWeekTrcnDsblPrcgNcnt = (queryParams) => {
  return fetchByFormUrlencoded('trcndsbl/ReadWeekTrcnDsblPrcgNcnt.ajax', queryParams);
};

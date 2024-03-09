import { fetchByFormUrlencoded } from '@/common/api/api';

export const fetchTropList = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/ReadTropList.ajax', queryParams);
};

export const fetchTrop = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/ReadTrop.ajax', queryParams);
};

export const updateTrop = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/UpdateTrop.ajax', queryParams);
};

export const fetchBusBsfcList = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/ReadBusBsfcList.ajax', queryParams);
};

export const fetchBusBsfc = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/ReadBusBsfc.ajax', queryParams);
};

export const updateBusBsfc = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/UpdateBusBsfc.ajax', queryParams);
};

export const fetchVhclList = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/ReadVhclList.ajax', queryParams);
};

export const fetchVhcl = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/ReadVhcl.ajax', queryParams);
};

export const updateVhcl = (queryParams) => {
  return fetchByFormUrlencoded('baseinf/UpdateVhcl.ajax', queryParams);
};

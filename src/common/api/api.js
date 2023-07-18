import { isPro, API_FETCH_TYPE, API_ROOT_URL } from '@common/constants/appEnv';
import { axiosFormUrlencoded, axiosFormData } from './axiosAPI';
import { fetchFormUrlencoded, fetchFormData } from './fetchAPI';

function fetchByFormUrlencoded(path, payload, headers) {
  const url = `${API_ROOT_URL}/${path}`;
  if (API_FETCH_TYPE === 'axios') {
    return axiosFormUrlencoded(url, payload, headers);
  }
  return fetchFormUrlencoded(url, payload, headers);
}

function fetchByFormData(path, payload, headers) {
  const url = `${API_ROOT_URL}/${path}`;
  if (API_FETCH_TYPE === 'axios') {
    return axiosFormData(url, payload, headers);
  }
  return fetchFormData(url, payload, headers);
}

function debug(msg, ...obj) {
  if (!isPro) {
    console.log(msg, ...obj);
  }
}

class CodeError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class SysError extends CodeError {
  constructor(code, message, cause) {
    super(code, message);
    this.cause = cause;
  }
}

class BizError extends CodeError {
  constructor(code, message, response) {
    super(code, message);
    this.response = response;
  }
}

export { fetchByFormUrlencoded, fetchByFormData, debug, SysError, BizError };

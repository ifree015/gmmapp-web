import axios from 'axios';
import { MESSAGE_CODES } from '@common/constants/messageCodes';
import { SysError, BizError } from './api';

function axiosFormUrlencoded(url, payload, headers) {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...headers,
    },
  };

  return axiosPost(url, new URLSearchParams({ ...payload }), config);
}

function axiosFormData(url, payload, headers) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers,
    },
  };

  return axiosPost(url, payload, config);
}

async function axiosPost(url, data, config) {
  let res = null;
  try {
    res = await axios.post(url, data, config);
  } catch (err) {
    // debug('API 서버 error:', err);
    throw new SysError(...MESSAGE_CODES.C5001, err);
  }

  let response = null;
  try {
    response = res.data;
  } catch (err) {
    // debug('API JSON error:', err);
  }

  if (res.status >= 200 && res.status <= 299) {
    if (!response) {
      throw new SysError(...MESSAGE_CODES.C5003);
    }
    if (response.result === 'error') {
      // 기존 Web 오류 처리 방식 지원
      throw new BizError(response.error.code, response.error.message, response);
    }
    return response;
  } else {
    // 400(Bad Request), ...
    if (response) {
      // 업무 오류가 발생했다면
      throw new BizError(response.error.code, response.error.message, response);
    }
    // 500(Internal Server Error), ...
    // debug('API 호출 error:', res);
    throw new SysError(...MESSAGE_CODES.C5002);
  }
}

export { axiosFormUrlencoded, axiosFormData };

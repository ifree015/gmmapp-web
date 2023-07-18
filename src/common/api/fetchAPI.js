import { MESSAGE_CODES } from '@common/constants/messageCodes';
import { SysError, BizError } from './api';

function fetchFormUrlencoded(url, payload, headers) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...headers,
    },
    body: new URLSearchParams({ ...payload }),
  };

  return fetchPost(url, options);
}

async function fetchFormData(url, payload, headers) {
  const options = {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data',
      ...headers,
    },
    body: payload,
  };

  return fetchPost(url, options);
}

async function fetchPost(url, options) {
  let res = null;
  try {
    res = await fetch(url, options);
  } catch (err) {
    // debug('API 서버 error:', err);
    throw new SysError(...MESSAGE_CODES.C5001, err);
  }

  let response = null;
  try {
    response = await res.json();
  } catch (err) {
    // debug('API JSON error:', err);
  }

  if (res.ok) {
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

export { fetchFormUrlencoded, fetchFormData };

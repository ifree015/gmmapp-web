function getLocalItem(key, initialValue) {
  return JSON.parse(window.localStorage.getItem(key)) || initialValue;
}

function setLocalItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeLocalItem(key) {
  return window.localStorage.removeItem(key);
}

function getSessionItem(key, initialValue) {
  return JSON.parse(window.sessionStorage.getItem(key)) || initialValue;
}

function setSessionItem(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

function removeSessionItem(key) {
  return window.sessionStorage.removeItem(key);
}

export {
  getLocalItem,
  setLocalItem,
  removeLocalItem,
  getSessionItem,
  setSessionItem,
  removeSessionItem,
};

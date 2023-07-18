function getLocalItem(key, initialValue) {
  return JSON.parse(window.localStorage.getItem(key)) || initialValue;
}

function setLocalItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeLocalItem(key) {
  return window.localStorage.removeItem(key);
}

export { getLocalItem, setLocalItem, removeLocalItem };

const { NODE_ENV } = process.env;

const isDev = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';
const isPro = NODE_ENV === 'production';

const APP_ROOT_URL = process.env.PUBLIC_URL;
const API_FETCH_TYPE = process.env.REACT_APP_API_FETCH_TYPE;
const API_ROOT_URL = process.env.REACT_APP_API_ROOT_URL;

export { isDev, isTest, isPro, APP_ROOT_URL, API_FETCH_TYPE, API_ROOT_URL };

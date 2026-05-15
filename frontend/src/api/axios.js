import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use(function (config) {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed && parsed.token) {
      config.headers.Authorization = 'Bearer ' + parsed.token;
    }
  }
  return config;
});

export default API;
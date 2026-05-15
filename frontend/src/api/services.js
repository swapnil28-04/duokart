import API from './axios';

export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
};

export const productAPI = {
  getAll: (filters) => {
    const params = new URLSearchParams(filters || {}).toString();
    return API.get('/products?' + params);
  },
};
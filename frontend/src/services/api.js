import axios from 'axios';

const API = axios.create({ baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:8081'}/api` });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
};

export const requestAPI = {
  getAll:        ()         => API.get('/requests'),
  getOpen:       ()         => API.get('/requests/open'),
  getById:       (id)       => API.get(`/requests/${id}`),
  create:        (data)     => API.post('/requests', data),
  getMy:         ()         => API.get('/requests/my'),
  updateStatus:  (id, status) => API.patch(`/requests/${id}/status?status=${status}`),
};

export const donorAPI = {
  getAvailable:     ()           => API.get('/donors'),
  searchByBlood:    (bloodType)  => API.get(`/donors/search?bloodType=${bloodType}`),
  toggleAvailability: ()         => API.patch('/donors/availability'),
};

export const donationAPI = {
  donate:   (data) => API.post('/donations', data),
  getMy:    ()     => API.get('/donations/my'),
  getCount: ()     => API.get('/donations/my/count'),
};

export const adminAPI = {
  getUsers:     () => API.get('/admin/users'),
  getDonations: () => API.get('/admin/donations'),
  getStats:     () => API.get('/admin/stats'),
};

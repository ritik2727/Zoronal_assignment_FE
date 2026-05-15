import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Companies
export const getCompanies = (params) => api.get('/companies', { params });
export const getCompanyById = (id) => api.get(`/companies/${id}`);
export const createCompany = (data) => api.post('/companies', data);
export const getCities = () => api.get('/companies/cities');

// Reviews
export const getReviews = (companyId, params) => api.get(`/reviews/${companyId}`, { params });
export const createReview = (data) => api.post('/reviews', data);
export const likeReview = (id) => api.patch(`/reviews/${id}/like`);

export default api;

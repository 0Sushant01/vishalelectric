import api from './axios';

export const getComplaints = (params) => api.get('complaints/', { params });
export const createComplaint = (data) => api.post('complaints/', data);
export const updateComplaintStatus = (id, status) => api.patch(`complaints/${id}/`, { status });
export const updateComplaint = (id, data) => api.patch(`complaints/${id}/`, data);
export const getComplaintDetail = (id) => api.get(`complaints/${id}/`);
export const getAnalytics = (params) => api.get('complaints/analytics/', { params });

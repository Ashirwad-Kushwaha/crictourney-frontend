import axios from 'axios';

const API_BASE = 'http://localhost:8081/auth';

export const signup = async (userData) => {
  return axios.post(`${API_BASE}/signup`, userData);
};

export const login = async (credentials) => {
  return axios.post(`${API_BASE}/login`, credentials);
};

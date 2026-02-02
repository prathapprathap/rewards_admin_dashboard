import axios from 'axios';

const API_URL = 'https://rewards-backend-zkhh.onrender.com/api/admin';

export const getStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const getTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
};

export const createOffer = async (offerData) => {
    const response = await axios.post(`${API_URL}/offers`, offerData);
    return response.data;
};

export const getOffers = async () => {
    const response = await axios.get(`${API_URL}/offers`);
    return response.data;
};

export const deleteOffer = async (id) => {
    const response = await axios.delete(`${API_URL}/offers/${id}`);
    return response.data;
};

export const adminLogin = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const getAppSettings = async () => {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
};

export const updateAppSettings = async (settings) => {
    const response = await axios.put(`${API_URL}/settings`, settings);
    return response.data;
};

export const getWithdrawals = async () => {
    const response = await axios.get(`${API_URL}/withdrawals`);
    return response.data;
};

export const updateWithdrawalStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/withdrawals/${id}`, { status });
    return response.data;
};

export const getPromoCodes = async () => {
    const response = await axios.get(`${API_URL}/promocodes`);
    return response.data;
};

export const deletePromoCode = async (id) => {
    const response = await axios.delete(`${API_URL}/promocodes/${id}`);
    return response.data;
};

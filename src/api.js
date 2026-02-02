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

// Database Management
const DB_API_URL = 'https://rewards-backend-zkhh.onrender.com/api/database';

export const getTables = async () => {
    const response = await axios.get(`${DB_API_URL}/tables`);
    return response.data;
};

export const getTableStructure = async (tableName) => {
    const response = await axios.get(`${DB_API_URL}/tables/${tableName}`);
    return response.data;
};

export const getTableData = async (tableName, page = 1, limit = 50) => {
    const response = await axios.get(`${DB_API_URL}/tables/${tableName}/data`, {
        params: { page, limit }
    });
    return response.data;
};

export const createRecord = async (tableName, data) => {
    const response = await axios.post(`${DB_API_URL}/tables/${tableName}`, data);
    return response.data;
};

export const updateRecord = async (tableName, id, data) => {
    const response = await axios.put(`${DB_API_URL}/tables/${tableName}/${id}`, data);
    return response.data;
};

export const deleteRecord = async (tableName, id) => {
    const response = await axios.delete(`${DB_API_URL}/tables/${tableName}/${id}`);
    return response.data;
};

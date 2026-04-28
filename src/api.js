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
export const getOfferSteps = async (id) => {
    const response = await axios.get(`${API_URL}/offers/${id}/steps`);
    return response.data;
};

export const deleteOffer = async (id) => {
    const response = await axios.delete(`${API_URL}/offers/${id}`);
    return response.data;
};
export const updateOffer = async (id, offerData) => {
    const response = await axios.put(`${API_URL}/offers/${id}`, offerData);
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
export const createPromoCode = async (promoData) => {
    const response = await axios.post(`${API_URL}/promocodes`, promoData);
    return response.data;
};

export const updatePromoCode = async (id, promoData) => {
    const response = await axios.put(`${API_URL}/promocodes/${id}`, promoData);
    return response.data;
};

export const deletePromoCode = async (id) => {
    const response = await axios.delete(`${API_URL}/promocodes/${id}`);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
};

export const getUserDetails = async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
};

export const getUserTransactions = async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}/transactions`);
    return response.data;
};

export const getUserWithdrawals = async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}/withdrawals`);
    return response.data;
};

export const getTopReferrers = async () => {
    const response = await axios.get(`${API_URL}/top-referrers`);
    return response.data;
};

export const updateUserBalance = async (id, balance) => {
    const response = await axios.put(`${API_URL}/users/${id}/balance`, { wallet_balance: balance });
    return response.data;
};

export const updatePassword = async (passwordData) => {
    const response = await axios.put(`${API_URL}/profile/password`, passwordData);
    return response.data;
};

export const getAdminProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
};

// Banner management
export const getBanners = async () => {
    const response = await axios.get(`${API_URL}/banners`);
    return response.data;
};

export const uploadBannerImage = async (imageFile) => {
    const response = await axios.post(`${API_URL}/banners/upload`, {
        image_file: imageFile,
    });
    return response.data;
};

export const createBanner = async (bannerData) => {
    const response = await axios.post(`${API_URL}/banners`, bannerData);
    return response.data;
};

export const updateBanner = async (id, bannerData) => {
    const response = await axios.put(`${API_URL}/banners/${id}`, bannerData);
    return response.data;
};

export const deleteBanner = async (id) => {
    const response = await axios.delete(`${API_URL}/banners/${id}`);
    return response.data;
};

// Recent Transactions
export const getTransactions = async () => {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
};

// Account Deactivation Requests
export const getDeleteRequests = async () => {
    const response = await axios.get(`${API_URL}/delete-requests`);
    return response.data;
};

export const updateDeleteRequestStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/delete-requests/${id}`, { status });
    return response.data;
};

// ── Payment Accounts (Bank / UPI) ──────────────────────────────────────────
export const getUserPaymentAccounts = async (userId) => {
    const response = await axios.get(`${API_URL}/users/${userId}/payment-accounts`);
    return response.data;
};

export const createPaymentAccount = async (userId, accountData) => {
    const response = await axios.post(`${API_URL}/users/${userId}/payment-accounts`, accountData);
    return response.data;
};

export const updatePaymentAccount = async (accountId, accountData) => {
    const response = await axios.put(`${API_URL}/payment-accounts/${accountId}`, accountData);
    return response.data;
};

export const deletePaymentAccount = async (accountId) => {
    const response = await axios.delete(`${API_URL}/payment-accounts/${accountId}`);
    return response.data;
};


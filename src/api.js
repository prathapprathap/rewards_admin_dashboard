import axios from 'axios';

// Set VITE_API_BASE per Vercel environment: api.rupirewards.xyz in Production,
// unset (or onrender) in Preview/staging.
const API_BASE = import.meta.env.VITE_API_BASE || 'https://rewards-backend-zkhh.onrender.com';
const API_URL = `${API_BASE}/api/admin`;

// Attach the admin JWT to every request (the backend requires it on /api/admin/*).
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is missing/expired, clear the session and return to login.
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminAuth');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

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

export const sendTelegramTest = async () => {
    const response = await axios.post(`${API_URL}/telegram/test`);
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

export const updateReferralCount = async (id, totalReferrals) => {
    const response = await axios.put(`${API_URL}/users/${id}/referral-count`, { total_referrals: totalReferrals });
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

export const updateAdminProfile = async (profileData) => {
    const response = await axios.put(`${API_URL}/profile`, profileData);
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

// ── Task Submissions (screenshot review) ──────────────────────────────────
export const getSubmissions = async (status) => {
    const url = status ? `${API_URL}/submissions?status=${status}` : `${API_URL}/submissions`;
    const response = await axios.get(url);
    return response.data;
};

export const reviewSubmission = async (id, payload) => {
    const response = await axios.put(`${API_URL}/submissions/${id}`, payload);
    return response.data;
};

export const deleteSubmission = async (id) => {
    const response = await axios.delete(`${API_URL}/submissions/${id}`);
    return response.data;
};

// ── Notifications (Push + In-app) ─────────────────────────────────────────
export const getNotifications = async () => {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
};

export const createNotification = async (payload) => {
    const response = await axios.post(`${API_URL}/notifications`, payload);
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await axios.delete(`${API_URL}/notifications/${id}`);
    return response.data;
};


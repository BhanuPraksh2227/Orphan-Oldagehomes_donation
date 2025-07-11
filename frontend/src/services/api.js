import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Removed /api prefix
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        console.log('Request URL:', config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Add facilities endpoints
export const getFacilities = async (type) => {
    try {
        const response = await api.get(`/facilities?type=${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        throw error;
    }
};

// Update donation endpoints
export const submitDonation = async (donationData) => {
    try {
        const response = await api.post('/api/donations/money', donationData);
        return response.data;
    } catch (error) {
        console.error('Error submitting donation:', error);
        throw error;
    }
};

export default api;
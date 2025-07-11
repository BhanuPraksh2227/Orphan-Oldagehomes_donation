import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createDonation = async (donationData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/donations`, donationData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getDonations = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/donations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
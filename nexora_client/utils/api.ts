import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

export const apiCall = async (endpoint: string, method: string = 'GET', data: any = null) => {
  try {
    const response = await api({
      url: endpoint,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export default api;

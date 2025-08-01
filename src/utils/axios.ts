import axios from 'axios';

import { CONFIG } from '../config-global';

// config

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.baseUrl });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
// );

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.error;
    // If the access token has expired and the server returns a 401 error with the specific error message
    if (statusCode === 401 && errorMessage === 'Access token expired' && !originalRequest._retry) {
      // Handle the access token expiration here
      originalRequest._retry = true;

      try {
        const { data } = await axiosInstance.post('/api/v1/auth/token/regenerate', {
          refreshToken: localStorage.getItem('refreshToken'),
        });

        if (data.success) {
          localStorage.setItem('accessToken', data.accessToken);

          // Resend the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error('Error regenerating access token:', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

/**
 * Create custom instance of Axios for intercepting and injecting headers like authorization.
 */
import axios, { AxiosRequestConfig } from 'axios';
import { refreshTokens } from './authentication';
import TokenService from '../util/services/tokenService';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

const API_BASE_URL_apiary =
  'https://private-26272e-cs3216a3group5.apiary-mock.com'; //TODO: Replace with real api link

const API_BASE_URL = 'https://goldfish-app-4g8cm.ondigitalocean.app';

const config: AxiosAuthRefreshRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(config);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (axios.isAxiosError(error)) {
      const originalConfig = error.config as AxiosRequestConfig & {
        isRefreshAttempt: boolean;
      };
      if (error.response?.status === 401 && !originalConfig.isRefreshAttempt) {
        await refreshTokens();
        return axiosInstance(originalConfig);
      }
    }
    return Promise.reject(error);
  }
);

export function getFullURL(url: string): string {
  return API_BASE_URL + url;
}

export default axiosInstance;

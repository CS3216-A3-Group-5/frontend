//@ts-nocheck
/**
 * Create custom instance of Axios for intercepting and injecting headers like authorization.
 */
import axios, { AxiosRequestConfig } from 'axios';
import { refreshTokens } from './authentication';
import TokenService from '../util/services/tokenService';
import { REGISTER_PATH, VERIFY_EMAIL_PATH } from './constants';

let refreshing_token = null;

const API_BASE_URL_APIARY =
  'https://private-26272e-cs3216a3group5.apiary-mock.com'; //TODO: Replace with real api link

const API_BASE_URL = 'https://goldfish-app-4g8cm.ondigitalocean.app';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (
      token &&
      config.url !== REGISTER_PATH &&
      config.url !== VERIFY_EMAIL_PATH
    ) {
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
        _isRefreshAttempt: boolean;
      };
      if (error.response?.status === 401 && !originalConfig._isRefreshAttempt) {
        originalConfig._isRefreshAttempt = true;
        try {
          refreshing_token = refreshing_token
            ? refreshing_token
            : refreshTokens();
           await refreshing_token;
          refreshing_token = null;
          const token = TokenService.getLocalAccessToken();
          if (
            token &&
            originalConfig.url !== REGISTER_PATH &&
            originalConfig.url !== VERIFY_EMAIL_PATH
          ) {
            if (!originalConfig.headers) {
              originalConfig.headers = {};
            }
            originalConfig.headers['Authorization'] = 'Bearer ' + token;
          }
          return axiosInstance(originalConfig);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export function getFullURL(url: string): string {
  return API_BASE_URL + url;
}

export default axiosInstance;

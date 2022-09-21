/**
 * Create custom instance of Axios for intercepting and injecting headers like authorization.
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import TokenService from '../util/services/tokenService';
import { REFRESH_TOKEN_PATH } from './constants';

const APIARY_BASE_URL = 'https://private-26272e-cs3216a3group5.apiary-mock.com'; //TODO: Replace with real api link

const API_BASE_URL = 'https://modulekakis-kxgwq.ondigitalocean.app/backend/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class RequestTokenError extends Error {
  constructor() {
    super('Insufficient tokens received from server');
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err: Error | AxiosError) => {
    if (!axios.isAxiosError(err)) {
      return Promise.reject(err);
    }
    const originalConfig = err.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    if (originalConfig.url !== '/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await axiosInstance.post(REFRESH_TOKEN_PATH, {
            refreshToken: TokenService.getLocalRefreshToken(),
          });
          /* eslint-disable */
          if (!rs.data || !rs.data.access_token || !rs.data.refresh_token) {
            throw new RequestTokenError();
          }
          TokenService.setTokens({
            accessToken: rs.data.access_token,
            refreshToken: rs.data.refresh_token,
          });
        } catch (_error) {
          // if 401 returned here, than need to login again
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;

/**
 * Create custom instance of Axios for intercepting and injecting headers like authorization.
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import TokenService from '../util/services/tokenService';
import { REFRESH_TOKEN_PATH } from './constants';

const API_BASE_URL_a = 'https://private-26272e-cs3216a3group5.apiary-mock.com'; //TODO: Replace with real api link

const API_BASE_URL = 'https://goldfish-app-4g8cm.ondigitalocean.app';

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
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createAxiosAuthenticationInterceptor();

function createAxiosAuthenticationInterceptor() {
  const interceptor = axiosInstance.interceptors.response.use(
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
        if (err.response.status === 401) {
          axiosInstance.interceptors.response.eject(interceptor);
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
            createAxiosAuthenticationInterceptor();
          } catch (_error) {
            // if 400 on refresh token sending, means also an issue with authentication
            if (axios.isAxiosError(_error) && _error.response?.status === 400) {
              _error.response.status = 401;
            }
            // if 401 returned here, than need to login again
            createAxiosAuthenticationInterceptor();
            return Promise.reject(_error);
          }
        }
      }
      createAxiosAuthenticationInterceptor();
      return Promise.reject(err);
    }
  );
}

export function getFullURL(url: string): string {
  return API_BASE_URL + url;
}

export default axiosInstance;

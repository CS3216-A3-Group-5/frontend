/**
 * API call handlers for authentication.
 */

import axiosInstance from '.';
import TokenService from '../util/services/tokenService';
import {
  REGISTER_PATH,
  VERIFY_AUTHENTICATION,
  VERIFY_EMAIL_PATH,
} from './constants';

interface TokenResponseData {
  access_token: string;
  refresh_token: string;
}

export async function registerUser(nus_email: string, password: string) {
  await axiosInstance.post(REGISTER_PATH, { nus_email, password });
}

export async function verifyEmail(nus_email: string, otp: string) {
  const response = await axiosInstance.post(VERIFY_EMAIL_PATH, {
    nus_email,
    otp,
  });

  // user should be created on backend at this point, now user can immediately be directed to home page
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access_token,
    refreshToken: tokenResponseData.refresh_token,
  });
}

/**
 * Returns true if the user is currently authenticated with their token.
 */
export async function verifyAuth() {
  try {
    await axiosInstance.get(VERIFY_AUTHENTICATION);
    return true;
  } catch (err) {
    return false;
  }
}

export async function login(nus_email: string, password: string) {
  const response = await axiosInstance.post('/login', { nus_email, password });
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access_token,
    refreshToken: tokenResponseData.refresh_token,
  });
}

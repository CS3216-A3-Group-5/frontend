/**
 * API call handlers for authentication.
 */

import axiosInstance from '.';
import { AuthenticationResponse } from '../pages/authentication/constants';
import TokenService from '../util/services/tokenService';
import {
  REGISTER_PATH,
  RESEND_OTP_PATH,
  VERIFY_AUTHENTICATION,
  VERIFY_EMAIL_PATH,
} from './constants';

interface TokenResponseData {
  access_token: string;
  refresh_token: string;
}

export interface UserLoginDetails {
  nus_email: string;
  password: string;
}

export async function registerUser(userRegisterDetails: UserLoginDetails) {
  const response = await axiosInstance.post<AuthenticationResponse>(
    REGISTER_PATH,
    userRegisterDetails
  );
  return response.data;
}

export async function verifyEmail(nus_email: string, otp: string) {
  const response = await axiosInstance.post<AuthenticationResponse>(
    VERIFY_EMAIL_PATH,
    {
      nus_email,
      otp,
    }
  );

  // user should be created on backend at this point, now user can immediately be directed to home page
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access_token,
    refreshToken: tokenResponseData.refresh_token,
  });
  return response.data;
}

export async function resendOtp(nus_email: string) {
  const response = await axiosInstance.post<AuthenticationResponse>(
    RESEND_OTP_PATH,
    {
      nus_email,
    }
  );
  return response.data;
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

export async function login(userLoginDetails: UserLoginDetails) {
  const response = await axiosInstance.post<AuthenticationResponse>(
    '/login',
    userLoginDetails
  );
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access_token,
    refreshToken: tokenResponseData.refresh_token,
  });
  return response.data;
}

export async function logout() {
  const tokens = TokenService.getTokens();
  if (!tokens) {
    // throw error?
    return;
  }
  const { refreshToken } = tokens;
  await axiosInstance.post('/logout', {
    refresh: refreshToken,
  });
}

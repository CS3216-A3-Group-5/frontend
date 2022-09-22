/**
 * API call handlers for authentication.
 */

import axios, { AxiosRequestConfig } from 'axios';
import axiosInstance from '.';
import { AuthenticationResponse } from '../pages/authentication/constants';

import TokenService from '../util/services/tokenService';
import {
  LOGIN_PATH,
  LOGOUT_PATH,
  REFRESH_TOKEN_PATH,
  REGISTER_PATH,
  RESEND_OTP_PATH,
  VERIFY_AUTHENTICATION,
  VERIFY_EMAIL_PATH,
} from './constants';

interface TokenResponseData {
  access: string;
  refresh: string;
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
    accessToken: tokenResponseData.access,
    refreshToken: tokenResponseData.refresh,
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
    await axiosInstance.post(VERIFY_AUTHENTICATION, {
      token: TokenService.getLocalAccessToken(),
    });
    return true;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return false;
    }
    throw err;
  }
}

export async function login(userLoginDetails: UserLoginDetails) {
  const response = await axiosInstance.post<AuthenticationResponse>(
    LOGIN_PATH,
    userLoginDetails,
    { skipAuthRefresh: true } as AxiosRequestConfig
  );
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access,
    refreshToken: tokenResponseData.refresh,
  });
  console.log(TokenService.getTokens());
  return response.data;
}

export async function refreshTokens() {
  const response = await axiosInstance.post<TokenResponseData>(
    REFRESH_TOKEN_PATH,
    {
      refresh: TokenService.getLocalRefreshToken(),
    },
    { isRefreshAttempt: true } as AxiosRequestConfig
  );
  const tokenResponseData = response.data;
  TokenService.setTokens({
    accessToken: tokenResponseData.access,
    refreshToken: tokenResponseData.refresh,
  });
}

export async function logout() {
  const refreshToken = TokenService.getLocalRefreshToken();
  TokenService.removeTokens();
  await axiosInstance.post(LOGOUT_PATH, {
    refresh: refreshToken,
  });
}

/**
 * API call handlers for authentication.
 */

import axios from 'axios';
import TokenService from '../util/services/tokenService';



interface TokenResponseData {
  access_token: string;
  refresh_token: string;
}

export async function registerUser(nus_email: string, password: string) {
  await axios.post('/register', { nus_email, password });
}

export async function verifyEmail(nus_email: string, otp: string) {
  const response = await axios.post('/verify', { nus_email, otp });

  // user should be created on backend at this point, now user can immediately be directed to home page
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access_token,
    refreshToken: tokenResponseData.refresh_token,
  });
}

export async function login(nus_email: string, password: string) {
  const response = await axios.post('/login', { nus_email, password });
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access_token,
    refreshToken: tokenResponseData.refresh_token,
  });
}

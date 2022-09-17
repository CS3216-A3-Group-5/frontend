/**
 * API call handlers for authentication.
 */

import axios from 'axios';
import TokenService from '../util/services/tokenService';

enum RegisterUserErrorReason {
  EMAIL_ALREADY_USED = 0,
}

enum VerifyEmailErrorReason {
  INCORRECT_OTP = 0,
}

enum LoginErrorReason {
  UNREGISTERED_EMAIL = 0,
  INVALID_PASSWORD = 1,
}

interface VerifyEmailResponseData {
  access_token: string;
  refresh_token: string;
}

export async function registerUser(nus_email: string, password: string) {
  await axios.post('/register', { nus_email, password });
}

export async function verifyEmail(nus_email: string, otp: string) {
  const response = await axios.post('/verify', { nus_email, otp });
  const verifyResponseData = response.data as VerifyEmailResponseData;

  TokenService.setTokens({
    accessToken: verifyResponseData.access_token,
    refreshToken: verifyResponseData.refresh_token,
  });
}

//TODO: email check logic
function checkValidEmail(nusEmail: string) {
  return true;
}

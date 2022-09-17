/**
 * API call handlers for authentication.
 */

import axios from 'axios';
import TokenService from '../util/services/tokenService';

interface ErrorResponse {
  error_message: string;
}

interface VerifyEmailResponseData {
  access_token: string;
  refresh_token: string;
}

class RegisterFieldsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class RegisterUserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function registerUser(
  nus_email: string,
  password: string,
  confirmPassword: string
) {
  // These checks should be performed on the main page as well, before this function can ever be called.
  if (password !== confirmPassword) {
    throw new RegisterFieldsError('Passwords do not match');
  }
  if (!checkValidEmail(nus_email)) {
    throw new RegisterFieldsError('Invalid NUS Email');
  }

  try {
    await axios.post(
      '/register',
      { nus_email, password }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const error_message = (error.response.data as ErrorResponse).error_message;
      //TODO: remove console log
      console.log('LOGIN ERROR: ', error_message);
      throw new RegisterUserError(error_message);
    } else {
      console.log('UNEXPECTED LOGIN ERROR: ', error);
      throw error;
    }
  }
}

export async function verifyEmail(nus_email: string, otp: string) {
  try {
    const response = await axios.post('/verify', { nus_email, otp });
    const verifyResponseData = response.data as VerifyEmailResponseData;

    TokenService.setTokens({accessToken: verifyResponseData.access_token, refreshToken: verifyResponseData.refresh_token})
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const error_message = (error.response.data as ErrorResponse)
        .error_message;
      //TODO: remove console log
      console.log('VERIFY EMAIL ERROR: ', error_message);
      throw new RegisterUserError(error_message);
    } else {
      console.log('UNEXPECTED LOGIN ERROR: ', error);
      throw error;
    } 
  }
}

export async function loginUser(email: string, password: string) {

}

//TODO: email check logic
function checkValidEmail(nusEmail: string) {
  return true;
}

/**
 * API call handlers for authentication.
 */

import axios from 'axios';

const apiUrl = 'https://private-52b1ef3-as3test.apiary-mock.com'; //TODO: Replace with real api link

type RegisterSuccessResponse = {
  is_email_sent: boolean;
};

type RegisterErrorResponse = {
  error_details: string;
};

export async function registerUser(
  nusEmail: string,
  password: string,
  confirmPassword: string
) {
  if (password !== confirmPassword) {
    throw Error('Passwords do not match');
  }
  if (!checkValidEmail(nusEmail)) {
    throw Error('Please use a valid NUS email');
  }

  try {
    const { data } = await axios.post<RegisterSuccessResponse>(
      apiUrl + '/register',
      { nus_email: nusEmail, password: password }
    );
    return data.is_email_sent;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const error_details = (error.response.data as RegisterErrorResponse)
        .error_details;
      console.log('axios error:', error_details);
      throw Error(error_details);
    } else {
      console.log('unexpected error: ', error);
      throw error;
    }
  }
}

//TODO: email check logic
function checkValidEmail(nusEmail: string) {
  return true;
}

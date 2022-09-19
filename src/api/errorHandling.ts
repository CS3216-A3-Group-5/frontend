import axios from 'axios';
import { useHistory } from 'react-router';
import { useAuth } from '../util/authentication/AuthContext';
import { LOGIN_PATH } from './constants';

/**
 * Defines the types of possible errors
 */
export enum ErrorType {
  UNKNOWN,
  NO_CONNECTION,
  TIMEOUT,
  AUTHENTICATION_FAIL,
}

/**
 * Handles any known expected errors, those that come with http code 200.
 * For example, psasword being wrong on login page is an expected error.
 */
export class ApiRequestError extends Error {
  errorType: ErrorType;
  constructor(errorType: number, errorMessage?: string) {
    super(errorMessage);
    this.errorType = errorType;
  }
}

export function useApiRequestErrorHandler() {
  const history = useHistory();
  const auth = useAuth();

  return function handleApiRequestError(error: unknown): ApiRequestError {
    if (!window.navigator.onLine) {
      // Not even online, cannot send request
      return new ApiRequestError(ErrorType.NO_CONNECTION);
    }
    if (error instanceof ApiRequestError) {
      // this is an error that is checked for, like no connection
      return error;
    }
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // check if the error from server is an authentication error
        if (error.response.status === 401) {
          auth.setIsAuthenticated(false);
          // redirect to login screen whenever a 401 occurs
          history.push(LOGIN_PATH);
          return new ApiRequestError(ErrorType.AUTHENTICATION_FAIL);
        }
        // some other error occured at server
        console.log('API requst error: ', error.message);
        return new ApiRequestError(ErrorType.UNKNOWN);
      } else if (error.request) {
        // no response received from server
        return new ApiRequestError(ErrorType.TIMEOUT);
      } else {
        // an unknown error occured
        console.log('API request error: ', error.message);
        return new ApiRequestError(ErrorType.UNKNOWN);
      }
    } else if (error instanceof Error) {
      console.log('API request error: ', error.message);
      return new ApiRequestError(ErrorType.UNKNOWN);
    } else {
      console.log('API request error: ', error);
      return new ApiRequestError(ErrorType.UNKNOWN);
    }
  };
}

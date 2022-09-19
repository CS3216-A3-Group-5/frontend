import axios from 'axios';
import { useHistory } from 'react-router';
import { useAuth } from '../util/authentication/AuthContext';
import { LOGIN_PATH } from './constants';

/**
 * Stanardised format for object received from server on error.
 */
export interface ErrorResponseData {
  error_message?: string;
  error_reason: number;
}

/**
 * Defines the types of possible errors
 */
export enum ErrorType {
  UNKNOWN,
  KNOWN,
  CONNECTION,
  AUTHENTICATION_FAIL,
}

/**
 * Standard ApiRequestError to be returned to pages that call apis when they handle erros
 */
export interface ApiRequestError {
  errorType: ErrorType;
  errorReason: number;
}

export function useApiRequestErrorHandler() {
  const history = useHistory();
  const auth = useAuth();

  return function handleApiRequestError(error: unknown): ApiRequestError {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // check if the error from server is an authentication error
        if (error.response.status === 401) {
          console.log('hello');
          auth.setIsAuthenticated(false);
          // redirect to login screen whenever a 401 occurs
          history.push(LOGIN_PATH);
          return {
            errorType: ErrorType.AUTHENTICATION_FAIL,
            errorReason: 0,
          };
        }

        // some other error occured at server
        return {
          errorType: ErrorType.UNKNOWN,
          errorReason: 0,
        };
      } else if (error.request) {
        // no response received from server
        return { errorType: ErrorType.CONNECTION, errorReason: 0 };
      } else {
        // an unknown error occured
        console.log('API request error: ', error.message);
        return { errorType: ErrorType.UNKNOWN, errorReason: 0 };
      }
    } else if (error instanceof Error) {
      console.log('API request error: ', error.message);
      return { errorType: ErrorType.UNKNOWN, errorReason: 0 };
    } else {
      console.log('API request error: ', error);
      return { errorType: ErrorType.UNKNOWN, errorReason: 0 };
    }
  };
}

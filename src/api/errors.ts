import axios from 'axios';

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
}

/**
 * Standard ApiRequestError to be returned to pages that call apis when they handle erros
 */
export interface ApiRequestError {
  errorType: ErrorType;
  errorReason: number;
}

export function handleApiRequestError(error: unknown): ApiRequestError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // some error happend at the server
      const errorData = error.response.data as ErrorResponseData;
      if (errorData.error_reason === 0) {
        // this error is one which client does not need to know about
        console.log(errorData.error_message);
        return {
          errorType: ErrorType.UNKNOWN,
          errorReason: errorData.error_reason - 1,
        };
      }
      return {
        errorType: ErrorType.KNOWN,
        errorReason: errorData.error_reason,
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
}

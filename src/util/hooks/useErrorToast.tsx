import { useIonToast } from '@ionic/react';
import { globe, alert } from 'ionicons/icons';
import { ApiRequestError, ErrorType } from '../../api/errorHandling';

function getIconForErrorType(errorType: ErrorType) {
  if (
    errorType === ErrorType.NO_CONNECTION ||
    errorType === ErrorType.TIMEOUT
  ) {
    return globe;
  } else {
    return alert;
  }
}

/**
 * Hook that returns a function that takes in an Api error and presents an error toast to user.
 */
export default function useErrorToast() {
  const [present] = useIonToast();
  const presentToast = (apiError: ApiRequestError, errorMessage?: string) => {
    let message = '';
    switch (apiError.errorType) {
      case ErrorType.AUTHENTICATION_FAIL:
        message = 'Authentication failed. Please login again.';
        break;
      case ErrorType.NO_CONNECTION:
        message = 'You are not connected to the internet';
        break;
      case ErrorType.TIMEOUT:
        message = 'Could not reach server. Please try again.';
        break;
      default:
        if (errorMessage) {
          message = errorMessage;
        } else {
          message = 'An unknown error occured. Please try again.';
        }
    }
    void present({
      message,
      color: 'danger',
      duration: 2000,
      position: 'top',
      icon: getIconForErrorType(apiError.errorType),
    });
  };
  return presentToast;
}

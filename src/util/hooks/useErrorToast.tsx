import { useIonToast } from '@ionic/react';
import { globe } from 'ionicons/icons';

enum ErrorToastErrorType {
  CONNECTION_FAIL,
  OTHER,
}

function getIconForErrorType(errorType: ErrorToastErrorType) {
  switch (errorType) {
    case ErrorToastErrorType.CONNECTION_FAIL:
      return globe;
    default:
      return '';
  }
}

/**
 * Hook that returns a function to present an error toast to user.
 */
export default function useErrorToast() {
  const [present] = useIonToast();
  const presentToast = (
    errorMessage: string,
    errorType: ErrorToastErrorType
  ) => {
    void present({
      message: errorMessage,
      color: 'danger',
      duration: 2000,
      position: 'top',
      icon: getIconForErrorType(errorType),
    });
  };
  return presentToast;
}

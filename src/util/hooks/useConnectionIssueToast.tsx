import { useIonToast } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import { DataRetrievalErrorType } from '../../redux/slices/objectDetailsSlice';

/**
 * Hook that returns a function that takes in an Api error and presents an error toast to user.
 */
export default function useConnectionIssueToast() {
  const [present] = useIonToast();
  const presentToast = (connectionErrorType: DataRetrievalErrorType) => {
    let message = "";
    if (connectionErrorType === DataRetrievalErrorType.NO_CONNECTION) {
      message = "You are not connected to the Internet. Information might not be up-to-date.";
    } else {
      message = "No response received from server. Information might not be up-to-date.";
    }
    void present({
      message,
      color: 'primary',
      duration: 2000,
      position: 'top',
      icon: informationCircleOutline,
    });
  };
  return presentToast;
}

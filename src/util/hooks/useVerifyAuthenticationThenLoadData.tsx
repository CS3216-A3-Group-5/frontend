import { useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { verifyAuth } from '../../api/authentication';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setIsLoggedIn,
  setWasInformedOfOfflineMode,
} from '../../redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { LOGIN } from '../../routes';
import useInfoToast from './useInfoToast';

/**
 * Verifies that a user is logged in before runnning the provided function to load data for that page.
 */
export default function useVerifyAuthenticationThenLoadData(
  loadDataFunc?: () => void,
  finalFunc?: () => void
) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const presentInfoToast = useInfoToast();
  const handleApiError = useApiRequestErrorHandler();
  const wasLoggedInPreviously = useAppSelector(
    (state) => state.user.isLoggedIn
  );
  const wasInformedOfOfflineMode = useAppSelector(
    (state) => state.user.wasInformedOfOfflineMode
  );
  useIonViewDidEnter(() => {
    verifyAuth()
      .then((result) => {
        dispatch(setIsLoggedIn(result));
        if (!result) {
          // authentication failed, purge the storage
          void persistor.purge();
          history.replace(LOGIN);
          return;
        }
        loadDataFunc && loadDataFunc();
      })
      .catch((err) => {
        //any other error other than 401 will allow access, but offline data only
        handleApiError(err);
        if (wasLoggedInPreviously) {
          // only inform the user once of offline mode
          if (!wasInformedOfOfflineMode) {
            dispatch(setWasInformedOfOfflineMode(true));
            presentInfoToast(
              'Unable to reach server. Displaying offline information.'
            );
          }
        } else {
          presentInfoToast(
            'Unable to login to server. Please try again.',
            'danger'
          );
          history.replace(LOGIN);
        }
      })
      .finally(finalFunc);
  }, [wasLoggedInPreviously, wasInformedOfOfflineMode]);
}

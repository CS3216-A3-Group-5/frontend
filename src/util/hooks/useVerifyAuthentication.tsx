import { useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { verifyAuth } from '../../api/authentication';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setIsLoggedIn } from '../../redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { LOGIN } from '../../routes';
import useInfoToast from './useInfoToast';

export default function useVerifyAuthentication() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const presentInfoToast = useInfoToast();
  const handleApiError = useApiRequestErrorHandler();
  const wasLoggedInPreviously = useAppSelector(
    (state) => state.user.isLoggedIn
  );
  const [isVerified, setIsVerified] = useState<boolean>(false);
  useLayoutEffect(() => {
    verifyAuth()
      .then((result) => {
        dispatch(setIsLoggedIn(result));
        setIsVerified(true);
        if (!result) {
          // authentication failed, purge the storage
          void persistor.purge();
          history.replace(LOGIN);
        }
      })
      .catch((err) => {
        //any other error other than 401 will allow access, but offline data only
        handleApiError(err);
        if (wasLoggedInPreviously) {
          presentInfoToast(
            'Unable to reach server. Displaying offline information.'
          );
          setIsVerified(true);
        } else {
          presentInfoToast(
            'Unable to login to server. Please try again.',
            'danger'
          );
          history.replace(LOGIN);
        }
      });
  }, []);
  return isVerified;
}
